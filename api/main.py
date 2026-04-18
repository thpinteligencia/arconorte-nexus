import sys
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Adiciona o diretório raiz ao path para permitir imports de api.*
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.services.comex_service import get_latest_comex_data
from api.services.predictor_service import PredictorService
from api.services.ipe_engine import IPEEngine

app = FastAPI(title="ArcoNorte Nexus API", version="1.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationRequest(BaseModel):
    capacity: int = 70000
    volSoja: float = 1.0
    volMilho: float = 1.0
    volArroz: float = 1.0

# --- CONSTANTES DE CENÁRIO (MOCKS) ---
MILHO_BASE = [2000, 3000, 10000, 15000, 12000, 8000, 4000, 2000, 1500, 1000, 500, 800]
ARROZ_BASE = [8000, 7000, 6000, 4000, 3000, 2000, 1500, 1000, 5000, 15000, 10000, 5000]

# Singleton do preditor com proteção de startup
try:
    predictor = PredictorService()
except Exception as e:
    print(f"🚨 ERRO CRÍTICO: Falha ao carregar modelos de IA: {e}")
    predictor = None

@app.get("/api/v1/status")
def get_status():
    return {
        "status": "operational" if predictor else "degraded",
        "engine": "Nexus Micro-LSTM", 
        "uf": "RR",
        "model_loaded": predictor is not None
    }

@app.post("/api/v1/predict/soja")
async def predict_soja(req: SimulationRequest):
    if not predictor:
        raise HTTPException(status_code=503, detail="Motor de IA não inicializado.")
    
    try:
        # 1. Coletar dados reais para lookback
        df_recent = get_latest_comex_data(uf_id=14, ncm=12019000, months_back=6)
        
        if df_recent.empty:
            raise HTTPException(status_code=503, detail="Dados ComexStat indisponíveis.")

        # 2. Rollout Recursivo (Soja Real com Sensibilidade)
        soja_preds = predictor.predict_12_months(df_recent, vol_soja=req.volSoja)
        
        # 3. Aplicar multiplicadores nos mocks
        milho_sim = [round(m * req.volMilho, 2) for m in MILHO_BASE]
        arroz_sim = [round(a * req.volArroz, 2) for a in ARROZ_BASE]
        
        # 4. Cálculo unificado IPE
        results = IPEEngine.calculate_metrics(
            soja_preds, 
            milho_sim, 
            arroz_sim, 
            req.capacity
        )
        
        return results

    except Exception as e:
        print(f"❌ Erro crítico: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
