import os
import json
import requests
import pandas as pd
from datetime import datetime
import time

API_URL = "https://api-comexstat.mdic.gov.br/general"
CACHE_PATH = "api/data/comex_cache.json"

def _load_cache():
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, 'r') as f:
                data = json.load(f)
                return pd.DataFrame(data)
        except:
            return pd.DataFrame()
    return pd.DataFrame()

def _save_cache(df):
    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    df.to_json(CACHE_PATH, orient='records', date_format='iso')

def get_latest_comex_data(uf_id: int, ncm: int, months_back: int = 12):
    """
    Busca dados recentes priorizando a API e usando Cache local como fallback.
    NOTA: Apresenta latência de ~3-5s por request para respeitar o rate limit (HTTP 429).
    """
    print(f"📡 Buscando dados vivos do ComexStat (NCM {ncm})...")
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
            resp = requests.post(API_URL, json=payload, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                registros = data.get("data", [])
                if isinstance(registros, dict): registros = registros.get("list", [])
                
                for r in registros:
                    mes = r.get("monthNumber") or r.get("month")
                    api_records.append({
                        "date": f"{r['year']}-{str(mes).zfill(2)}-01",
                        "kg": float(r["metricKG"]),
                        "fob": float(r["metricFOB"])
                    })
            else:
                print(f"⚠️ API retornou status {resp.status_code} para o ano {ano}")
        except Exception as e:
            print(f"⚠️ Falha na conexão com ComexStat: {e}")
        
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
        print("✅ Cache atualizado com dados novos da API.")
    else:
        print("⚠️ Usando apenas dados em Cache (API indisponível).")
        df_combined = df_cache

    if df_combined.empty:
        return pd.DataFrame()

    # Converter datas e ordenar
    df_combined['date'] = pd.to_datetime(df_combined['date'])
    df_combined = df_combined.sort_values("date").tail(months_back).reset_index(drop=True)
    
    return df_combined
