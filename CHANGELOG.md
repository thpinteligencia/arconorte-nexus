# Changelog

## [1.3.1] - 2026-04-24
### Security
- **Hardening:** Removidas todas as API Keys e credenciais do código-fonte do Frontend.
- **Proxy:** Implementada injeção de `X-API-Key` via proxy (Vite) para ocultar segredos do cliente.
- **CORS:** Restrição de origens permitidas no Backend para evitar acessos não autorizados.

### Fixed
- **Session Management:** Refatorada a gestão de sessões do SQLAlchemy no `PredictorService`, eliminando riscos de vazamento de conexão.
- **Error Handling:** Adicionado tratamento de rollback em logs de auditoria.

### Added
- **Infrastructure:** Adicionado `docker-compose.yml` para suporte a PostgreSQL e Redis.
- **PostgreSQL Support:** Implementado suporte a múltiplos dialetos no `database.py` via `DATABASE_URL`.
- **Environment:** Criados arquivos `.env` e `.env.example` para gestão segura de configurações.

## [1.3.0] - 2026-04-20
### Added
- Documentação completa em `docs/` (README, Arquitetura, API, Padrões, Codebase).
- Pasta `claude/` com arquivos essenciais para persistência de contexto.
- Configuração inicial de `todos/` para rastreamento de tarefas.

### Changed
- Refatoração da estrutura de documentação para o padrão Gemini-Kit.
