import sys
import os
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.responses import StreamingResponse
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Tipo auxiliar para APIKey (FastAPI não exporta APIKey diretamente como tipo, é apenas uma string ou herança)
APIKey = str

# Configurações de Segurança
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# Chaves carregadas de variáveis de ambiente com fallback para dev
ENV_KEYS = os.environ.get("NEXUS_API_KEYS", "nexus_dev_2026,sefaz_rr_partner,aprosoja_rr_nexus")
VALID_API_KEYS = [key.strip() for key in ENV_KEYS.split(",")]

async def get_api_key(header_key: str = Security(api_key_header)):
    if header_key in VALID_API_KEYS:
        return header_key
    raise HTTPException(
        status_code=403, detail="Acesso negado: API Key inválida ou ausente."
    )

# Adiciona o diretório raiz ao path para permitir imports de server.*
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server.services.comex_service import get_latest_comex_data
from server.services.predictor_service import PredictorService
from server.services.ipe_engine import IPEEngine
from server.services.reporting_service import ReportingService
from server.db.database import get_db, engine
from server.db.models import Base, InferenceLog, ModelEvaluation

# Criar tabelas se não existirem
Base.metadata.create_all(bind=engine)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REGISTRY_PATH = os.path.join(BASE_DIR, "data", "model_registry.json")

app = FastAPI(
    title="ArcoNorte Nexus API", 
    version="2.0.0",
    description="""
    API de Inteligência Logística para o Arco Norte Brasileiro.
    
    Esta API fornece predições de escoamento de safras baseadas em modelos Micro-LSTM (Deep Learning) 
    e calcula o IPE (Índice de Pressão de Escoamento) em tempo real.
    
    **Acesso restrito a parceiros institucionais.**
    """,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationRequest(BaseModel):
    capacity: int = 70000
    uf: str = "14" # Default Roraima
    volSoja: float = 1.0

# Singleton do preditor
try:
    predictor = PredictorService()
except Exception as e:
    print(f"🚨 ERRO CRÍTICO IA: {e}")
    predictor = None

@app.get("/api/v1/status")
def get_status(db: Session = Depends(get_db)):
    # Verificar Banco
    db_ok = False
    try:
        db.execute("SELECT 1")
        db_ok = True
    except:
        pass

    # Caminho de modelos (importado de predictor_service se necessário, ou recalculado)
    from server.services.predictor_service import ARTIFACTS_DIR
    models_dir_ok = os.path.exists(ARTIFACTS_DIR)
    
    return {
        "status": "operational" if (db_ok and predictor) else "degraded",
        "components": {
            "ia_engine": predictor is not None,
            "database": db_ok,
            "storage_models": models_dir_ok
        },
        "version": "2.1.0-demo"
    }

@app.get("/api/v1/registry")
def get_registry(api_key: APIKey = Depends(get_api_key)):
    """Retorna lista de UFs e NCMs disponíveis para o Frontend."""
    if not os.path.exists(REGISTRY_PATH):
        return {}
    with open(REGISTRY_PATH, 'r') as f:
        return json.load(f)

@app.get("/api/v1/audit/metrics")
def get_audit_metrics(db: Session = Depends(get_db), api_key: APIKey = Depends(get_api_key)):
    """Retorna métricas de auditoria e logs de inferência."""
    evaluations = db.query(ModelEvaluation).all()
    logs_count = db.query(InferenceLog).count()
    recent_logs = db.query(InferenceLog).order_by(InferenceLog.timestamp.desc()).limit(10).all()
    
    return {
        "evaluations": evaluations,
        "total_inferences": logs_count,
        "recent_logs": recent_logs
    }

@app.post("/api/v1/predict/soja")
async def predict_soja(req: SimulationRequest, api_key: APIKey = Depends(get_api_key)):
    if not predictor:
        raise HTTPException(status_code=503, detail="Motor de IA indisponível.")
    
    try:
        # 1. Coletar dados reais para lookback
        df_recent = get_latest_comex_data(uf_id=int(req.uf), ncm=12019000, months_back=6)
        
        if df_recent.empty:
            raise HTTPException(status_code=503, detail="Dados ComexStat indisponíveis.")

        # 2. Rollout Recursivo (IA Real por UF)
        soja_preds = predictor.predict_12_months(df_recent, ncm="12019000", uf_id=req.uf, vol_mult=req.volSoja)
        
        # 3. Cálculo unificado IPE (Foco Soja)
        results = IPEEngine.calculate_metrics(soja_preds, req.capacity)
        return results

    except Exception as e:
        print(f"❌ Erro predição: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/report/pdf")
async def generate_pdf_report(req: SimulationRequest, api_key: APIKey = Depends(get_api_key)):
    """Gera e retorna o Boletim Estratégico em PDF."""
    if not predictor:
        raise HTTPException(status_code=503, detail="Motor de IA indisponível.")
    
    try:
        # 1. Coletar dados para predição
        df_recent = get_latest_comex_data(uf_id=int(req.uf), ncm=12019000, months_back=6)
        if df_recent.empty:
            raise HTTPException(status_code=503, detail="Dados ComexStat indisponíveis.")

        soja_preds = predictor.predict_12_months(df_recent, ncm="12019000", uf_id=req.uf, vol_mult=req.volSoja)
        results = IPEEngine.calculate_metrics(soja_preds, req.capacity)
        
        # 2. Gerar PDF
        ufs_map = {"14": "Roraima", "13": "Amazonas", "15": "Pará", "51": "Mato Grosso"}
        uf_name = ufs_map.get(req.uf, f"UF {req.uf}")
        
        pdf_buffer = ReportingService.generate_soja_report(
            uf_name=uf_name,
            ncm="12019000",
            ipe=results["overallIPE"],
            chart_data=results["chartData"]
        )
        
        filename = f"Boletim_Nexus_{uf_name}_{datetime.now().strftime('%Y%m%d')}.pdf"
        
        return StreamingResponse(
            pdf_buffer, 
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        print(f"❌ Erro geração PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
