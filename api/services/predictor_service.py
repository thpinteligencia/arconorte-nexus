import os
import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from datetime import datetime, timedelta

# Configurações do Modelo
ARTIFACTS_DIR = "api/artifacts"
LOOKBACK = 3
N_FEATURES = 3 # KG, FOB, SafraAtiva
MAX_TONS = 200000 # Teto de sanidade (2x pico histórico RR)

class PredictorService:
    def __init__(self):
        # Mapeamento do caminho absoluto para evitar erros de execução
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_path, "artifacts", "soy_rr_model.keras")
        scaler_path = os.path.join(base_path, "artifacts", "soy_rr_scaler.pkl")
        
        self.model = load_model(model_path)
        self.scaler = joblib.load(scaler_path)

    def _get_safra_ativa(self, date: datetime):
        # Roraima: Agosto a Dezembro
        return 1 if date.month in [8, 9, 10, 11, 12] else 0

    def predict_12_months(self, df_recent: pd.DataFrame, vol_soja: float = 1.0):
        """
        Executa o Rollout Recursivo de 12 meses com multiplicador de cenário.
        """
        if len(df_recent) < LOOKBACK:
            raise ValueError(f"Dados insuficientes para inferência. Necessário {LOOKBACK} meses.")

        # Preparar dados iniciais (lookback)
        df_recent = df_recent.copy()
        df_recent['safra'] = df_recent['date'].apply(self._get_safra_ativa)
        current_data = df_recent[['kg', 'fob', 'safra']].tail(LOOKBACK).values
        
        predictions = []
        last_date = df_recent['date'].max()
        
        # Estado inicial para rollout
        current_window = self.scaler.transform(current_data)
        
        for i in range(12):
            input_seq = current_window.reshape(1, LOOKBACK, N_FEATURES)
            pred_scaled = self.model.predict(input_seq, verbose=0)[0][0]
            
            # Inverse Transform Parcial (KG)
            dummy = np.zeros((1, N_FEATURES))
            dummy[0, 0] = pred_scaled
            pred_unscaled = self.scaler.inverse_transform(dummy)[0][0]
            
            # Sanity Checks
            kg_pred_base = max(0, min(MAX_TONS * 1000, pred_unscaled))
            # Aplicação do multiplicador de cenário (Sensibilidade)
            kg_pred = kg_pred_base * vol_soja
            
            # Estratégia Proporcional para FOB
            last_kg = current_data[-1, 0]
            last_fob = current_data[-1, 1]
            if last_kg > 0:
                fob_pred = last_fob * (kg_pred / last_kg)
            else:
                fob_pred = last_fob
                
            next_date = last_date + timedelta(days=31)
            next_date = next_date.replace(day=1)
            safra_pred = self._get_safra_ativa(next_date)
            
            predictions.append({
                "date": next_date.strftime("%b"),
                "soja": round(kg_pred / 1000, 2), # Toneladas
                "fob": round(fob_pred, 2)
            })
            
            # Atualizar Janela de Rollout (Sempre com o valor base para não realimentar o erro da sensibilidade no próximo passo)
            new_row_unscaled = np.array([[kg_pred_base, fob_pred / vol_soja if vol_soja != 0 else last_fob, safra_pred]])
            new_row_scaled = self.scaler.transform(new_row_unscaled)
            current_window = np.vstack([current_window[1:], new_row_scaled])
            current_data = np.vstack([current_data[1:], new_row_unscaled])
            last_date = next_date
            
        return predictions
