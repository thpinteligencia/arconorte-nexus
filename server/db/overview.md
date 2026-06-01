A pasta **`server/db`** é a camada de **persistência e acesso ao banco de dados** da aplicação backend, utilizando o ORM **SQLAlchemy**. 

Ela contém os seguintes arquivos estruturais:

### 1. **`database.py`**
* **Responsabilidade**: Configuração de conexão e sessões do banco de dados.
* **O que faz**:
  * Carrega a string de conexão a partir da variável de ambiente `DATABASE_URL` (ideal para conectar a um PostgreSQL externo em produção).
  * Possui um mecanismo de *fallback* automático: caso nenhuma URL seja fornecida, ele cria e utiliza o banco de dados SQLite local no caminho `server/data/nexus.db`.
  * Cria o `engine` do SQLAlchemy aplicando otimizações específicas (ex: desabilitar verificação de mesma thread para SQLite, ou gerenciar conexões/pooling para PostgreSQL).
  * Cria a classe `Base` de declaração dos modelos e a sessão de conexão `SessionLocal`.
  * Fornece a função geradora `get_db()`, que abre e fecha conexões de maneira limpa para ser injetada como dependência nas rotas do FastAPI.

### 2. **`models.py`**
* **Responsabilidade**: Definição dos esquemas de tabelas do banco de dados representados como classes Python.
* **O que faz**:
  * Mapeia as entidades do negócio para o banco SQL. Possui quatro modelos principais:
    1. **`InferenceLog`** (`inference_logs`): Guarda o histórico de previsões geradas pelo sistema (qual NCM e UF foram solicitados, o multiplicador de volume, a semente de dados recentes utilizada e o resultado de 12 meses gerado em formato JSON).
    2. **`ModelEvaluation`** (`model_evaluations`): Registra métricas de erro estatístico de performance do modelo (RMSE, MAE), data da última validação e se o modelo está ativo.
    3. **`APIKey`** (`api_keys`): Gerencia credenciais e tokens de acesso de clientes à API para controle de autenticação e segurança.
    4. **`ReportLog`** (`report_logs`): Registra a geração de relatórios de exportação, o tipo do relatório gerado, os parâmetros empregados e o momento da criação.

### Resumo da Pasta
Em suma, `server/db` funciona como o ponto central que diz **como conectar ao banco de dados** (`database.py`) e **como as tabelas estão estruturadas** (`models.py`).