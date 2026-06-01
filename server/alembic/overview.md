A pasta **`server/alembic`** é o diretório de configurações e histórico de **migrações de banco de dados** do projeto, gerenciado pelo **Alembic** (uma ferramenta de migração leve para uso com o SQLAlchemy no Python).

### O que tem nessa pasta?

1. **`env.py`**:
   * É o script de execução do ambiente do Alembic. Ele é executado sempre que uma ferramenta de migração é invocada.
   * Ele carrega os metadados do banco (`Base.metadata` vindo de `server.db.models`) para detectar alterações nos modelos SQLAlchemy (`autogenerate`) e configura dinamicamente a string de conexão com o banco de dados importando a URL (`SQLALCHEMY_DATABASE_URL`) definida em `server/db/database.py`.

2. **`script.py.mako`**:
   * É um arquivo de template Mako usado pelo Alembic para gerar a estrutura inicial de novos arquivos de migração.

3. **`versions/`**:
   * Diretório que armazena o histórico cronológico de alterações do banco de dados (scripts de migração). Atualmente possui duas migrações:
     * **`395da77ddc9a_initial_migration.py`**: Criação inicial das tabelas `inference_logs` e `model_evaluations`.
     * **`b8648b0f6fcb_add_api_keys_report_logs_and_indices.py`**: Adiciona as tabelas `api_keys` e `report_logs`, além de criar os índices de busca otimizada nas tabelas.

### O que ela faz?

Ela permite **rastrear, criar e aplicar alterações estruturais no banco de dados** de forma controlada e versionada (equivalente a um controle de versão Git, mas para o esquema do seu banco de dados SQL), possibilitando que o esquema do banco de dados evolua de forma segura conforme os modelos Python no backend são alterados.