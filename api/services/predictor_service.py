import os
import json
import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from datetime import datetime, timedelta

from api.utils.crop_calendars import is_safra_ativa
from api.db.database import SessionLocal
from api.db.models import InferenceLog

# Configurações de Caminhos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGISTRY_PATH = os.path.join(BASE_DIR, "data", "model_registry.json")
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")

LOOKBACK = 3
N_FEATURES = 3 

class PredictorService:
    def __init__(self):
        self.loaded_models = {} # Cache em memória

    def _load_registry(self):
        if not os.path.exists(REGISTRY_PATH):
            return {}
        with open(REGISTRY_PATH, 'r') as f:
            return json.load(f)

    def _get_model_assets(self, ncm: str, uf_id: str):
        registry = self._load_registry()
        model_meta = registry.get(ncm, {}).get(uf_id)
        
        if not model_meta or model_meta.get("status") != "active":
            return None, None, None # Default fallback tons

        cache_key = f"{ncm}_{uf_id}"
        if cache_key not in self.loaded_models:
            print(f"📦 Carregando ativos do registro para NCM {ncm}, UF {uf_id}...")
            m_path = os.path.join(ARTIFACTS_DIR, model_meta["model_path"])
            s_path = os.path.join(ARTIFACTS_DIR, model_meta["scaler_path"])
            
            if not os.path.exists(m_path) or not os.path.exists(s_path):
                return None, None, None
                
            model = load_model(m_path)
            scaler = joblib.load(s_path)
            self.loaded_models[cache_key] = (model, scaler)
            
        return self.loaded_models[cache_key][0], self.loaded_models[cache_key][1], model_meta.get("max_tons_sanity", 500000)

    def predict_12_months(self, df_recent: pd.DataFrame, ncm: str, uf_id: str, vol_mult: float = 1.0):
        """
        Executa o Rollout Recursivo baseado no Model Registry.
        """
        model, scaler, max_tons = self._get_model_assets(ncm, uf_id)
        if not model or not scaler:
            raise ValueError(f"Modelo para NCM {ncm} e UF {uf_id} não encontrado ou inativo.")

        if len(df_recent) < LOOKBACK:
            raise ValueError(f"Dados insuficientes ({len(df_recent)}) para inferência.")

        # Preparar dados iniciais
        df_recent = df_recent.copy()
        df_recent['safra'] = df_recent['date'].apply(lambda d: is_safra_ativa(ncm, uf_id, d))
        current_data = df_recent[['kg', 'fob', 'safra']].tail(LOOKBACK).values
        
        predictions = []
        last_date = df_recent['date'].max()
        current_window = scaler.transform(current_data)
        
        for i in range(12):
            input_seq = current_window.reshape(1, LOOKBACK, N_FEATURES)
            pred_scaled = model.predict(input_seq, verbose=0)[0][0]
            
            dummy = np.zeros((1, N_FEATURES))
            dummy[0, 0] = pred_scaled
            pred_unscaled = scaler.inverse_transform(dummy)[0][0]
            
            # Sanity Check Dinâmico por UF
            kg_pred_base = max(0, min(max_tons * 1000, pred_unscaled))
            kg_pred = kg_pred_base * vol_mult
            
            # Proporcional FOB
            last_kg = current_data[-1, 0]
            last_fob = current_data[-1, 1]
            fob_pred = last_fob * (kg_pred / last_kg) if last_kg > 0 else last_fob
                
            next_date = last_date + timedelta(days=31)
            next_date = next_date.replace(day=1)
            safra_pred = is_safra_ativa(ncm, uf_id, next_date)
            
            predictions.append({
                "date": next_date.strftime("%b"),
                "soja": round(kg_pred / 1000, 2),
                "fob": round(fob_pred, 2)
            })
            
            new_row_unscaled = np.array([[kg_pred_base, last_fob, safra_pred]])
            new_row_scaled = scaler.transform(new_row_unscaled)
            current_window = np.vstack([current_window[1:], new_row_scaled])
            current_data = np.vstack([current_data[1:], new_row_unscaled])
            last_date = next_date
            
        # Auditoria: Registrar inferência no banco de dados
        self._log_inference(
            uf=uf_id,
            ncm=ncm,
            vol_mult=vol_mult,
            predictions=predictions,
            seed_data=df_recent.tail(LOOKBACK).to_dict(orient='records')
        )
            
        return predictions

    def _log_inference(self, uf, ncm, vol_mult, predictions, seed_data):
        """Registra a inferência para trilha de auditoria."""
        try:
            db = SessionLocal()
            log_entry = InferenceLog(
                uf=uf,
                ncm=ncm,
                vol_mult=vol_mult,
                predicted_values=predictions,
                input_seed_months=seed_data
            )
            db.add(log_entry)
            db.commit()
            db.close()
        except Exception as e:
            print(f"⚠️ Erro ao registrar log de auditoria: {e}")
