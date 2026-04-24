from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import sys

# Setup paths
SERVER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(SERVER_DIR)

from db.models import InferenceLog
from db.database import SessionLocal

def test_log():
    try:
        db = SessionLocal()
        log_entry = InferenceLog(
            uf="14",
            ncm="12019000",
            vol_mult=1.0,
            predicted_values=[{"date": "May", "soja": 100.0}],
            input_seed_months=[{"date": "Apr", "kg": 50.0}]
        )
        db.add(log_entry)
        db.commit()
        print("✅ Log inserted successfully")
        db.refresh(log_entry)
        print(f"Log ID: {log_entry.id}")
        db.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_log()
