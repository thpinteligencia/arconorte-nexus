A pasta **`server/tests`** contém a suíte de **testes automatizados** do backend (testes de unidade e de integração), garantindo que as modificações no código não quebrem funcionalidades existentes e que a comunicação com serviços externos seja robusta.

Ela contém os seguintes arquivos:

### 1. **`connectivity_check.py`**
* **Função**: Script de diagnóstico rápido para verificar conectividade e integração com APIs externas.
* **O que faz**: Tenta realizar requisições simuladas reais de dados de comércio exterior (soja) para as quatro UFs de interesse (Roraima, Amazonas, Pará e Mato Grosso) chamando a função `get_latest_comex_data` do `comex_service`. Ele serve para diagnosticar rapidamente no console se as credenciais, conexões de internet e APIs externas do MDIC estão ativas e respondendo no formato esperado.

### 2. **`test_comex_service.py`**
* **Função**: Suíte de testes unitários escrita em **`pytest`** com foco na resiliência e integridade do consumo de dados da API.
* **O que faz**: Utiliza mocks da biblioteca `unittest.mock` para simular cenários complexos de comportamento de rede sem realizar chamadas reais à internet (o que acelera os testes e isola o código de falhas externas):
  * **Caso de Sucesso (`test_get_latest_comex_data_success`)**: Garante que o retorno estruturado de dados da API para múltiplos anos é parseado corretamente no DataFrame do Pandas e salvo no arquivo de cache local.
  * **Caso de Rate Limit (`test_get_latest_comex_data_rate_limit_resilience`)**: Valida se o serviço lida corretamente com erros de *Rate Limit* (HTTP 429) do governo, repetindo a requisição com sucesso.
  * **Caso de Fallback (`test_get_latest_comex_data_fallback_to_cache`)**: Testa se a aplicação aciona corretamente o cache local quando a API externa está totalmente fora do ar (erro de conexão).
  * **Caso de Falha de Schema (`test_get_latest_comex_data_schema_failure_handling`)**: Assegura que falhas de integridade em chaves ausentes na resposta da API lancem um erro controlado (`KeyError`) em vez de falhas silenciosas.

### 3. **`test_ipe_engine.py`**
* **Função**: Testes de unidade escritos sob o framework padrão **`unittest`** para validação matemática da engine de IPE.
* **O que faz**: Fornece uma entrada de projeções mockadas de 12 meses de soja para a classe `IPEEngine` e valida se os cálculos matemáticos do percentual de pressão sobre o escoamento, pico total e formação do objeto final do gráfico estão matematicamente corretos em relação a uma capacidade hipotética.

### Resumo da Pasta
Em suma, `server/tests` é a camada de controle de qualidade que garante a **estabilidade, resiliência contra falhas de rede de APIs governamentais e precisão matemática** do servidor do Arconorte-Nexus.