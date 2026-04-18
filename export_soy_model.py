import os
import json
import requests
import pandas as pd
import numpy as np
import time
import joblib
import warnings
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping

warnings.filterwarnings('ignore')

# --- CONFIGURAÇÕES ---
API_URL = "https://api-comexstat.mdic.gov.br/general"
UF_ID = 14  # Roraima
NCM_ALVO = 12019000  # Soja
LOOKBACK = 3
N_FEATURES = 3 
ARTIFACTS_DIR = "api/artifacts"
FALLBACK_XLSX = "exportacoes_rr.xlsx"

if not os.path.exists(ARTIFACTS_DIR):
    os.makedirs(ARTIFACTS_DIR)

# --- INGESTÃO FALLBACK (XLSX PIVOTADO) ---
def fetch_via_xlsx(file_path):
    print(f"📂 Carregando e despivotando dados de fallback: {file_path}")
    try:
        df_raw = pd.read_excel(file_path)
        
        # Filtrar pela NCM Alvo
        df_ncm = df_raw[df_raw['Código NCM'] == NCM_ALVO].copy()
        
        records = []
        # Identificar anos disponíveis nas colunas (ex: '2024 - Valor US$ FOB')
        anos = sorted(set([col.split(' - ')[0] for col in df_raw.columns if ' - ' in col]))
        
        # Mapa de meses
        meses_map = {
            '01. Janeiro': 1, '02. Fevereiro': 2, '03. Março': 3, '04. Abril': 4,
            '05. Maio': 5, '06. Junho': 6, '07. Julho': 7, '08. Agosto': 8,
            '09. Setembro': 9, '10. Outubro': 10, '11. Novembro': 11, '12. Dezembro': 12
        }

        for _, row in df_ncm.iterrows():
            mes_nome = row['Mês']
            mes_num = meses_map.get(mes_nome)
            if not mes_num: continue
            
            for ano in anos:
                col_fob = f"{ano} - Valor US$ FOB"
                col_kg = f"{ano} - Quilograma Líquido"
                
                if col_fob in row and col_kg in row:
                    records.append({
                        "Data": datetime(int(ano), mes_num, 1),
                        "Peso_Liquido": float(row[col_kg]),
                        "Valor_FOB": float(row[col_fob])
                    })
        
        df = pd.DataFrame(records)
        df = df[df['Data'] >= '2019-01-01'].copy()
        df = df.sort_values('Data').drop_duplicates('Data').reset_index(drop=True)
        return df
    except Exception as e:
        print(f"❌ Erro crítico no ETL do XLSX: {e}")
        import traceback
        traceback.print_exc()
        return pd.DataFrame()

def fetch_via_api(uf_id, ncm):
    # (Mantido como tentativa inicial, mas sabemos que o Rate Limit é real)
    print(f"🚀 Tentando ingestão ComexStat (API) para UF {uf_id}, NCM {ncm}...")
    # ... lógica simplificada para brevidade, mas o fallback é o foco aqui ...
    return pd.DataFrame() 

def fetch_comex_data(uf_id, ncm):
    # Forçando fallback devido ao rate limit conhecido e necessidade de 84 registros
    print("⚠️ Usando Fallback XLSX como fonte primária para garantir 84+ registros.")
    return fetch_via_xlsx(FALLBACK_XLSX)

# --- PRE-PROCESSAMENTO ---
def prepare_data(df):
    df['Safra_Ativa'] = df['Data'].dt.month.apply(lambda x: 1 if x in [8, 9, 10, 11, 12] else 0)
    df = df.sort_values('Data').reset_index(drop=True)
    features = ['Peso_Liquido', 'Valor_FOB', 'Safra_Ativa']
    data = df[features].values
    scaler = MinMaxScaler()
    data_scaled = scaler.fit_transform(data)
    X, y = [], []
    for i in range(len(data_scaled) - LOOKBACK):
        X.append(data_scaled[i:(i + LOOKBACK), :])
        y.append(data_scaled[i + LOOKBACK, 0]) 
    return np.array(X), np.array(y), scaler

# --- MODELO ---
def train_final_model(X, y):
    print(f"🧠 Treinando modelo LSTM Final com {len(X)} sequências...")
    model = Sequential([
        Input(shape=(LOOKBACK, N_FEATURES)),
        LSTM(8, activation='relu', kernel_regularizer=l2(0.01)),
        Dropout(0.3),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    early_stop = EarlyStopping(monitor='loss', patience=10, restore_best_weights=True)
    model.fit(X, y, epochs=50, batch_size=4, callbacks=[early_stop], verbose=1)
    return model

if __name__ == "__main__":
    df_final = fetch_comex_data(UF_ID, NCM_ALVO)
    
    if df_final.empty or len(df_final) < 80:
        print(f"❌ Dados insuficientes ({len(df_final)}). ETL falhou.")
    else:
        print(f"📊 {len(df_final)} registros coletados com sucesso.")
        X, y, scaler = prepare_data(df_final)
        model = train_final_model(X, y)
        model.save(os.path.join(ARTIFACTS_DIR, "soy_rr_model.keras"))
        joblib.dump(scaler, os.path.join(ARTIFACTS_DIR, "soy_rr_scaler.pkl"))
        print(f"✅ Artefatos regenerados com sucesso (Sinal Histórico Completo).")
