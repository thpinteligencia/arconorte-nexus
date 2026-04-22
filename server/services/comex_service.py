import os
import json
import requests
import pandas as pd
from datetime import datetime
import time
import logging

# Configuração de Logging para Visibilidade Total
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_URL = "https://api-comexstat.mdic.gov.br/general"
CACHE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "comex_cache.json")

def _load_cache():
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, 'r') as f:
                data = json.load(f)
                return pd.DataFrame(data)
        except Exception as e:
            logger.error(f"❌ Falha ao carregar cache: {e}")
            return pd.DataFrame()
    return pd.DataFrame()

def _save_cache(df):
    try:
        os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
        df.to_json(CACHE_PATH, orient='records', date_format='iso')
    except Exception as e:
        logger.error(f"❌ Falha ao salvar cache: {e}")

def get_latest_comex_data(uf_id: int, ncm: int, months_back: int = 12):
    """
    Busca dados recentes priorizando a API e usando Cache local como fallback.
    NOTA: Apresenta latência de ~3-5s por request para respeitar o rate limit (HTTP 429).
    """
    logger.info(f"📡 Buscando dados vivos do ComexStat (NCM {ncm})...")
    current_year = datetime.now().year
    years = [current_year - 1, current_year]
    api_records = []

    # 1. Tentar coletar da API
    for ano in years:
        payload = {
            "flow": "export", "monthDetail": True,
            "period": {"from": f"{ano}-01", "to": f"{ano}-12"},
            "filters": [
                {"filter": "state", "values": [str(uf_id)]},
                {"filter": "ncm", "values": [str(ncm)]}
            ],
            "details": ["state", "ncm"],
            "metrics": ["metricFOB", "metricKG"]
        }
        try:
            # Implementação de Retry para evitar 429 (Rate Limit)
            max_retries = 3
            for attempt in range(max_retries):
                resp = requests.post(API_URL, json=payload, timeout=15)
                if resp.status_code == 200:
                    data = resp.json()
                    registros = data.get("data", [])
                    if isinstance(registros, dict): registros = registros.get("list", [])
                    
                    for r in registros:
                        try:
                            mes = r.get("monthNumber") or r.get("month")
                            api_records.append({
                                "date": f"{r['year']}-{str(mes).zfill(2)}-01",
                                "kg": float(r["metricKG"]),
                                "fob": float(r["metricFOB"])
                            })
                        except (KeyError, ValueError) as e:
                            logger.error(f"❌ Erro de integridade no registro {r}: {e}")
                            raise # Re-raise para não silenciar falha de schema
                    break # Sucesso, sai do loop de retry
                elif resp.status_code == 429:
                    wait_time = (attempt + 1) * 5
                    logger.warning(f"⚠️ Rate Limit (429). Aguardando {wait_time}s (tentativa {attempt+1}/{max_retries})...")
                    time.sleep(wait_time)
                    if attempt == max_retries - 1:
                        logger.error("❌ Limite de retries atingido para Rate Limit (429).")
                else:
                    logger.error(f"⚠️ API retornou status {resp.status_code} para o ano {ano}. Resposta: {resp.text}")
                    break
        except requests.exceptions.RequestException as e:
            logger.error(f"⚠️ Falha na conexão com ComexStat: {e}")
        
        time.sleep(1.5) # Cortesia com a API (Prevenção de 429)

    # 2. Gestão de Cache e Fallback
    df_cache = _load_cache()
    
    if api_records:
        df_api = pd.DataFrame(api_records)
        # Mesclar API com Cache (API sobrescreve registros de mesma data)
        if not df_cache.empty:
            df_combined = pd.concat([df_cache, df_api]).drop_duplicates("date", keep="last")
        else:
            df_combined = df_api
        _save_cache(df_combined)
        logger.info("✅ Cache atualizado com dados novos da API.")
    else:
        logger.warning("⚠️ Usando apenas dados em Cache (API indisponível ou vazia).")
        df_combined = df_cache

    if df_combined.empty:
        logger.error("❌ Nenhum dado disponível (API e Cache vazios).")
        return pd.DataFrame()

    # Converter datas e ordenar
    df_combined['date'] = pd.to_datetime(df_combined['date'])
    df_combined = df_combined.sort_values("date").tail(months_back).reset_index(drop=True)
    
    return df_combined
