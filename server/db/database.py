from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging

# Configuração de Logs
logger = logging.getLogger("nexus.db")

# Priorizar DATABASE_URL da variável de ambiente
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    # Fallback para SQLite local se não houver URL definida
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DB_PATH = os.path.join(BASE_DIR, "data", "nexus.db")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
    logger.info(f"💾 Usando SQLite: {DB_PATH}")
else:
    logger.info("🐘 Database URL detectada. Iniciando conexão externa.")

# Configuração do Engine com otimizações
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    # Postgres e outros dialetos
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        pool_recycle=3600
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependência do FastAPI com melhor tratamento de erro
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"❌ Erro de sessão de banco: {e}")
        raise
    finally:
        db.close()
