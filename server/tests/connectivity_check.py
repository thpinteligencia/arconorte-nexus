import sys
import os
import pandas as pd

# Add the root directory to sys.path to allow imports from server.*
sys.path.append(os.getcwd())

try:
    from server.services.comex_service import get_latest_comex_data
    print("✅ Successfully imported get_latest_comex_data")
    
    ufs = {"14": "Roraima", "13": "Amazonas", "15": "Pará", "51": "Mato Grosso"}
    
    for uf_id, uf_name in ufs.items():
        print(f"\nTesting ComexStat connectivity for UF {uf_id} ({uf_name})...")
        df = get_latest_comex_data(uf_id=int(uf_id), ncm=12019000, months_back=3)
        
        if not df.empty:
            print(f"✅ Success for {uf_name}! Received {len(df)} records.")
            print(df.tail(1))
        else:
            print(f"⚠️ Received empty dataframe for {uf_name}.")
            
except Exception as e:
    print(f"❌ Error during connectivity test: {e}")
    sys.exit(1)
