A pasta **`server/data`** é a pasta de armazenamento de dados operacionais e arquivos locais utilizados pelo servidor em tempo de execução. Ela contém os seguintes arquivos:

### 1. **`nexus.db`**
* É o banco de dados **SQLite** local da aplicação. 
* Ele armazena as tabelas do sistema gerenciadas pelas migrações do Alembic, servindo para:
  * **Chaves de API (`api_keys`)**: controle de chaves de acesso ativas para consumir a API.
  * **Logs de Inferência (`inference_logs`)**: trilha de auditoria contendo as variáveis usadas e os resultados preditos em cada chamada de modelo.
  * **Logs de Relatório (`report_logs`)**: histórico de relatórios gerados por usuários.
  * **Avaliação de Modelos (`model_evaluations`)**: métricas de desempenho validadas (como RMSE e MAE) de cada modelo.

### 2. **`model_registry.json`**
* É o **registro centralizador de metadados dos modelos de Machine Learning**.
* Ele mapeia cada combinação de `NCM` (Código Fiscal do Produto) e `UF` (Estado) para as configurações do modelo correspondente, definindo:
  * O nome do arquivo do modelo treinado (`model_path`).
  * O nome do escalador (`scaler_path`).
  * Métricas de erro (como RMSE).
  * Limites de sanidade logística (`max_tons_sanity`) para evitar previsões absurdas de volume (toneladas).
  * Status de atividade do modelo.

### 3. **`comex_cache.json`**
* É um **cache de dados históricos** obtidos da API do MDIC ComexStat (com dados de Peso Líquido `kg` e Valor `fob` mensais desde 2015).
* Serve para evitar consultas repetitivas de API externa (que possui limites estritos de requisições por minuto - *rate limits*) e acelerar a alimentação dos últimos meses necessários para realizar a janela de previsão (*lookback*) nas inferências recursivas do modelo.

### Resumo da Pasta
Em suma, esta pasta é o repositório de estado persistente local (banco de dados operacional SQLite, registros de IA ativos e cache de API externa) essencial para o funcionamento do backend do Arconorte-Nexus.