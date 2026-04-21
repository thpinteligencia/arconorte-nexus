import os
import json
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping

from api.utils.crop_calendars import is_safra_ativa

# Configurações de Diretórios
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")
REGISTRY_PATH = os.path.join(BASE_DIR, "data", "model_registry.json")

LOOKBACK = 3
N_FEATURES = 3

class TrainEngine:
    def __init__(self):
        os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    def etl_xlsx(self, file_path: str, ncm_alvo: int, uf_id: int):
        """Despivota o XLSX do ComexStat para série temporal linear."""
        print(f"📂 ETL: {file_path} (NCM {ncm_alvo})")
        df_raw = pd.read_excel(file_path)
        df_ncm = df_raw[df_raw['Código NCM'] == ncm_alvo].copy()
        
        records = []
        anos = sorted(set([col.split(' - ')[0] for col in df_raw.columns if ' - ' in col]))
        meses_map = {
            '01. Janeiro': 1, '02. Fevereiro': 2, '03. Março': 3, '04. Abril': 4,
            '05. Maio': 5, '06. Junho': 6, '07. Julho': 7, '08. Agosto': 8,
            '09. Setembro': 9, '10. Outubro': 10, '11. Novembro': 11, '12. Dezembro': 12
        }

        for _, row in df_ncm.iterrows():
            mes_num = meses_map.get(row['Mês'])
            if not mes_num: continue
            for ano in anos:
                col_fob, col_kg = f"{ano} - Valor US$ FOB", f"{ano} - Quilograma Líquido"
                if col_fob in row and col_kg in row:
                    records.append({
                        "Data": datetime(int(ano), mes_num, 1),
                        "Peso_Liquido": float(row[col_kg]),
                        "Valor_FOB": float(row[col_fob])
                    })
        
        df = pd.DataFrame(records)
        df = df[df['Data'] >= '2019-01-01'].copy()
        # Uso da lógica centralizada
        df['Safra_Ativa'] = df['Data'].apply(lambda d: is_safra_ativa(str(ncm_alvo), str(uf_id), d))
        return df.sort_values('Data').reset_index(drop=True)

    def train_model(self, df: pd.DataFrame, ncm: int, uf_id: int):
        """Treina e serializa o modelo Micro-LSTM."""
        features = ['Peso_Liquido', 'Valor_FOB', 'Safra_Ativa']
        data = df[features].values
        
        scaler = MinMaxScaler()
        data_scaled = scaler.fit_transform(data)
        
        X, y = [], []
        for i in range(len(data_scaled) - LOOKBACK):
            X.append(data_scaled[i:(i + LOOKBACK), :])
            y.append(data_scaled[i + LOOKBACK, 0])
        X, y = np.array(X), np.array(y)

        model = Sequential([
            Input(shape=(LOOKBACK, N_FEATURES)),
            LSTM(8, activation='relu', kernel_regularizer=l2(0.01)),
            Dropout(0.3),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        early_stop = EarlyStopping(monitor='loss', patience=10, restore_best_weights=True)
        
        history = model.fit(X, y, epochs=50, batch_size=4, callbacks=[early_stop], verbose=0)
        final_loss = history.history['loss'][-1]

        # Salvar Artefatos
        suffix = f"{ncm}_{uf_id}"
        m_name, s_name = f"model_{suffix}.keras", f"scaler_{suffix}.pkl"
        model.save(os.path.join(ARTIFACTS_DIR, m_name))
        joblib.dump(scaler, os.path.join(ARTIFACTS_DIR, s_name))

        self._update_registry(ncm, uf_id, m_name, s_name, final_loss)
        return final_loss

    def _update_registry(self, ncm, uf_id, m_name, s_name, rmse):
        registry = {}
        if os.path.exists(REGISTRY_PATH):
            with open(REGISTRY_PATH, 'r') as f: registry = json.load(f)
        
        ncm_str, uf_str = str(ncm), str(uf_id)
        if ncm_str not in registry: registry[ncm_str] = {}
        
        registry[ncm_str][uf_str] = {
            "name": f"NCM {ncm} - UF {uf_id}",
            "model_path": m_name,
            "scaler_path": s_name,
            "rmse": round(float(rmse), 6),
            "last_train": datetime.now().strftime("%Y-%m-%d"),
            "status": "active"
        }
        
        with open(REGISTRY_PATH, 'w') as f:
            json.dump(registry, f, indent=2)
        print(f"✅ Registro atualizado: {ncm_str}/{uf_str}")

if __name__ == "__main__":
    # Teste rápido se rodado diretamente
    engine = TrainEngine()
    print("Nexus Train Engine pronto.")
