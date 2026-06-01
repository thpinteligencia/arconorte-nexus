# Plano de Migração de Dados (SQLite ➔ PostgreSQL)

Este documento descreve o planejamento técnico para migrar a persistência de dados do banco de dados local SQLite para uma instância robusta em PostgreSQL.

---

## 🛠️ Fase de Migração

### Passo 1: Infraestrutura e Provisionamento
- [ ] Provisionar instância PostgreSQL (AWS RDS ou Docker Dedicado).
- [ ] Configurar parâmetros de segurança (VPC, Security Groups).
- [ ] Criar database `arconorte_nexus` e usuário com privilégios limitados.

### Passo 2: Sincronização de Esquema
- [ ] Atualizar string de conexão no `server/db/database.py` para usar o driver `psycopg2`.
- [ ] Configurar o Alembic para suportar os dialetos específicos do PostgreSQL.
- [ ] Executar `alembic upgrade head` para criar as tabelas, índices e restrições (constraints) no banco de destino.

### Passo 3: Extração e Transformação (ETL)
- [ ] Extrair dados do SQLite para arquivos JSON/CSV temporários.
- [ ] Tratar tipos de dados incompatíveis (ex: formatos de data de texto do SQLite para timestamps do PostgreSQL, booleanos).
- [ ] Validar integridade referencial localmente antes de iniciar a carga.

### Passo 4: Carga de Dados e Validação
- [ ] Importar os dados via scripts Python (utilizando SQLAlchemy) ou comando `COPY` nativo do PostgreSQL.
- [ ] Executar queries de conferência (verificação de contagem de linhas e somatórios de controle).
- [ ] Validar performance e criação de índices junto ao Administrador de Banco de Dados.

### Passo 5: Cutover e Monitoramento
- [ ] Apontar a aplicação de produção para o novo endpoint de banco de dados PostgreSQL.
- [ ] Monitorar logs de erro e exceções de conexão via Sentry.
- [ ] Manter o arquivo SQLite antigo como backup somente-leitura (read-only) por pelo menos 7 dias.
