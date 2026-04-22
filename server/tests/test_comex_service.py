import pytest
import pandas as pd
import json
import os
import requests
from unittest.mock import MagicMock, patch
from server.services.comex_service import get_latest_comex_data

# Configurações de Mock para Respostas da API
MOCK_API_RESPONSE_2023 = {
    "data": {
        "list": [
            {"year": 2023, "monthNumber": 12, "metricKG": "1000.5", "metricFOB": "5000.75"}
        ]
    }
}

MOCK_API_RESPONSE_2024 = {
    "data": {
        "list": [
            {"year": 2024, "monthNumber": 1, "metricKG": "2000.0", "metricFOB": "10000.0"}
        ]
    }
}

@pytest.fixture
def mock_cache(tmp_path):
    """
    Cria um arquivo de cache temporário para evitar poluição do ambiente de dev/prod.
    """
    cache_file = tmp_path / "comex_cache_test.json"
    with patch("server.services.comex_service.CACHE_PATH", str(cache_file)):
        yield cache_file

@pytest.fixture
def mock_sleep():
    """
    Desativa o time.sleep para acelerar a execução dos testes.
    """
    with patch("time.sleep", return_value=None):
        yield

class TestComexIngestionLayer:
    """
    Suíte de testes para a camada de ingestão de dados do ComexStat.
    Focado em visibilidade, resiliência e integridade.
    """

    def test_get_latest_comex_data_success(self, mocker, mock_cache, mock_sleep):
        """
        CENÁRIO: Sucesso na chamada da API para dois anos distintos.
        VERIFICA: Integridade, Schema e Persistência.
        """
        mock_req = mocker.patch("requests.post")
        
        # Configura respostas diferentes para 2023 e 2024
        resp_2023 = MagicMock()
        resp_2023.status_code = 200
        resp_2023.json.return_value = MOCK_API_RESPONSE_2023
        
        resp_2024 = MagicMock()
        resp_2024.status_code = 200
        resp_2024.json.return_value = MOCK_API_RESPONSE_2024
        
        mock_req.side_effect = [resp_2023, resp_2024]

        df = get_latest_comex_data(uf_id=13, ncm=12019000)

        # Asserts de Integridade
        assert not df.empty
        assert len(df) == 2
        
        # Ordenação correta: 2023-12 antes de 2024-01
        assert df.iloc[0]["date"].year == 2023
        assert df.iloc[1]["date"].year == 2024
        assert df.iloc[0]["kg"] == 1000.5
        assert df.iloc[1]["fob"] == 10000.0
        
        # Verificação de persistência
        assert os.path.exists(mock_cache)

    def test_get_latest_comex_data_rate_limit_resilience(self, mocker, mock_cache, mock_sleep):
        """
        CENÁRIO: API retorna HTTP 429 (Rate Limit).
        """
        mock_req = mocker.patch("requests.post")
        
        mock_resp_429 = MagicMock()
        mock_resp_429.status_code = 429
        
        mock_resp_200 = MagicMock()
        mock_resp_200.status_code = 200
        mock_resp_200.json.return_value = MOCK_API_RESPONSE_2024
        
        # Falha 2 vezes, depois sucesso
        mock_req.side_effect = [mock_resp_429, mock_resp_429, mock_resp_200, mock_resp_200]

        df = get_latest_comex_data(uf_id=13, ncm=12019000)

        assert mock_req.call_count >= 3
        assert not df.empty

    def test_get_latest_comex_data_fallback_to_cache(self, mocker, mock_cache, mock_sleep):
        """
        CENÁRIO: API indisponível (Erro de Conexão).
        """
        # Preparar cache
        cache_data = [{"date": "2023-10-01", "kg": 500.0, "fob": 2500.0}]
        with open(mock_cache, 'w') as f:
            json.dump(cache_data, f)

        # Simular falha de rede
        mocker.patch("requests.post", side_effect=requests.exceptions.ConnectionError("Offline"))

        df = get_latest_comex_data(uf_id=13, ncm=12019000)

        assert not df.empty
        assert len(df) == 1
        assert df.iloc[0]["kg"] == 500.0

    def test_get_latest_comex_data_schema_failure_handling(self, mocker, mock_cache, mock_sleep):
        """
        CENÁRIO: Resposta da API com campos faltando (Schema Inválido).
        """
        BAD_RESPONSE = {
            "data": {"list": [{"year": 2024, "monthNumber": 1}]} # Faltam kg/fob
        }
        
        mock_req = mocker.patch("requests.post")
        mock_req.return_value.status_code = 200
        mock_req.return_value.json.return_value = BAD_RESPONSE

        # Agora o código re-raise o erro, então esperamos KeyError
        with pytest.raises(KeyError):
            get_latest_comex_data(uf_id=13, ncm=12019000)

    def test_get_latest_comex_data_empty_response_preserves_cache(self, mocker, mock_cache, mock_sleep):
        """
        CENÁRIO: API retorna 200 OK mas sem dados. O cache não deve ser destruído.
        """
        # Cache inicial
        initial_cache = [{"date": "2023-01-01", "kg": 100.0, "fob": 1000.0}]
        with open(mock_cache, 'w') as f:
            json.dump(initial_cache, f)

        mock_req = mocker.patch("requests.post")
        mock_req.return_value.status_code = 200
        mock_req.return_value.json.return_value = {"data": []}

        df = get_latest_comex_data(uf_id=13, ncm=12019000)

        assert not df.empty
        assert len(df) == 1
        assert df.iloc[0]["kg"] == 100.0
