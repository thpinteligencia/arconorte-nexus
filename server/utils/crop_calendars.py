from datetime import datetime

# Centralização das janelas de safra por UF/NCM
# Formato: { "uf_id": [meses_de_safra] }
# NCM Soja: 12019000

CROP_CALENDARS = {
    "12019000": {
        "14": [8, 9, 10, 11, 12],      # Roraima
        "51": [2, 3, 4, 5, 6],         # Mato Grosso
        "15": [6, 7, 8, 9, 10, 11],    # Pará (Corrigido conforme train_engine)
        "13": [7, 8, 9, 10, 11, 12]     # Amazonas
    }
}

def is_safra_ativa(ncm: str, uf_id: str, date: datetime) -> int:
    """Verifica se a safra está ativa para a cultura e estado informados."""
    active_months = CROP_CALENDARS.get(str(ncm), {}).get(str(uf_id), [])
    return 1 if date.month in active_months else 0
