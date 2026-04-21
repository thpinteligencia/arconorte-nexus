from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class InferenceLog(Base):
    __tablename__ = "inference_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    uf = Column(String)
    ncm = Column(String)
    vol_mult = Column(Float)
    
    # Valores preditos para os próximos 12 meses
    # Armazenado como JSON para flexibilidade
    predicted_values = Column(JSON)
    
    # Dados reais usados como semente (lookback)
    input_seed_months = Column(JSON)

class ModelEvaluation(Base):
    __tablename__ = "model_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    ncm = Column(String)
    uf = Column(String)
    rmse = Column(Float)
    mae = Column(Float)
    last_validation = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="active")
