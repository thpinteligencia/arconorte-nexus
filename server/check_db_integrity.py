from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import sys

# Setup paths
SERVER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(SERVER_DIR)

from db.models import InferenceLog, ModelEvaluation
from db.database import DB_PATH

engine = create_engine(f"sqlite:///{DB_PATH}")
Session = sessionmaker(bind=engine)
session = Session()

print(f"Database Path: {DB_PATH}")

# Check InferenceLog
log_count = session.query(InferenceLog).count()
print(f"InferenceLog count: {log_count}")
if log_count > 0:
    last_log = session.query(InferenceLog).order_by(InferenceLog.timestamp.desc()).first()
    print(f"Last InferenceLog: ID={last_log.id}, UF={last_log.uf}, NCM={last_log.ncm}, Timestamp={last_log.timestamp}")

# Check ModelEvaluation
eval_count = session.query(ModelEvaluation).count()
print(f"ModelEvaluation count: {eval_count}")
if eval_count > 0:
    for ev in session.query(ModelEvaluation).all():
        print(f"Eval: NCM={ev.ncm}, UF={ev.uf}, RMSE={ev.rmse}, MAE={ev.mae}, Status={ev.status}")

session.close()
