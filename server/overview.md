Aqui está a explicação do que faz cada um dos arquivos mencionados no diretório `server`:

### 1. **`alembic.ini`**
* **Função**: Arquivo de configuração global do **Alembic** (gerenciador de migrações de banco de dados).
* **O que faz**: Define onde estão localizados os arquivos de script e migrações (configurado como `script_location = %(here)s/alembic`), define as configurações de logging para as migrações e o formato padrão de nomenclatura dos arquivos de versão gerados pelo sistema.

### 2. **`check_db_integrity.py`**
* **Função**: Script utilitário para **auditoria e validação rápida do banco de dados local**.
* **O que faz**: Conecta-se diretamente ao arquivo SQLite (`nexus.db`), faz uma contagem rápida de registros e imprime no console as últimas entradas das tabelas de logs (`InferenceLog`) e métricas de desempenho de IA (`ModelEvaluation`). É útil para depuração e para garantir que o banco está recebendo e estruturando os dados corretamente.

### 3. **`main.py`**
* **Função**: É o **ponto de entrada (entrypoint) principal da aplicação web backend** usando o framework **FastAPI**.
* **O que faz**:
  * Configura e instancia a API do FastAPI (título, documentação via Swagger, CORS para comunicação com o frontend React/Vite).
  * Implementa **autenticação** por meio do cabeçalho customizado `X-API-Key` (validando contra chaves nas variáveis de ambiente `NEXUS_API_KEYS`).
  * Garante que a estrutura das tabelas SQL seja criada na inicialização do servidor.
  * Expõe as rotas REST da API:
    * `GET /api/v1/status`: Verifica a integridade operacional da IA, banco de dados e arquivos físicos.
    * `GET /api/v1/registry`: Lista as UFs e NCMs disponíveis para predição.
    * `GET /api/v1/audit/metrics`: Consolida os logs de auditoria e avaliações do modelo.
    * `POST /api/v1/predict/soja`: Roda o ciclo de ETL do ComexStat, executa o modelo recursivo LSTM de 12 meses e retorna os dados de previsão + o Índice de Pressão (IPE).
    * `POST /api/v1/report/pdf`: Gera dinamicamente e transmite o boletim estratégico de logística formatado em PDF para download direto.

### 4. **`requirements.txt`**
* **Função**: Declaração das **dependências de terceiros do projeto Python**.
* **O que faz**: Lista todas as bibliotecas e frameworks que o projeto precisa para rodar (como `fastapi` e `uvicorn` para a API, `tensorflow` e `scikit-learn` para a IA, `sqlalchemy` para o banco de dados, `weasyprint` e `jinja2` para renderização de PDF). Esse arquivo é usado pelo instalador `pip` dentro do ambiente virtual (`venv`) para configurar o backend de forma idêntica em qualquer máquina.

### 5. **`test_logging.py`**
* **Função**: Script de teste rápido para **verificar se o banco de dados está aceitando escritas**.
* **O que faz**: Instancia uma sessão de banco de dados, cria um registro fictício de log de inferência (`InferenceLog`) com dados simulados de soja para Roraima (UF 14) e tenta commitar no banco SQLite. Imprime o ID de sucesso se a gravação funcionar ou a mensagem de erro se a transação falhar.