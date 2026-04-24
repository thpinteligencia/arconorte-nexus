from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class InferenceLog(Base):
    __tablename__ = "inference_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    uf = Column(String, index=True)
    ncm = Column(String, index=True)
    vol_mult = Column(Float)
    
    # Valores preditos para os próximos 12 meses
    # Armazenado como JSON para flexibilidade
    predicted_values = Column(JSON)
    
    # Dados reais usados como semente (lookback)
    input_seed_months = Column(JSON)

class ModelEvaluation(Base):
    __tablename__ = "model_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    ncm = Column(String, index=True)
    uf = Column(String, index=True)
    rmse = Column(Float)
    mae = Column(Float)
    last_validation = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="active")

class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    client_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

class ReportLog(Base):
    __tablename__ = "report_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    uf = Column(String, index=True)
    ncm = Column(String, index=True)
    report_type = Column(String) # Ex: "Boletim Estratégico Mensal"
    parameters = Column(JSON)    # Parâmetros usados na geração
