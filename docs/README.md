# 📚 Documentação do ArcoNorte Nexus (v2.0)

Bem-vindo à central de documentação oficial do **ArcoNorte Nexus**, uma plataforma de Inteligência Logística focada na predição de escoamento de grãos no Arco Norte brasileiro (com foco primário no Porto Seco de Roraima).

Este repositório de conhecimento está organizado de forma semântica para facilitar a consulta rápida por desenvolvedores, engenheiros de dados, cientistas de dados e stakeholders.

---

## 🗺️ Mapa da Documentação

### 📖 Fundamentos do Projeto
- **[Visão Geral do Projeto](./project-overview.md):** Objetivos estratégicos, roadmap do produto e principais stakeholders.
- **[Arquitetura do Sistema](./system-architecture.md):** Detalhamento técnico da integração entre o Frontend (React + CSS Modules) e o Backend (FastAPI + IPE Engine).
- **[Resumo do Codebase](./codebase-summary.md):** Guia rápido sobre a estrutura física de arquivos, diretórios e fluxos Single Source of Truth (SSoT).
- **[Padrões de Código](./code-standards.md):** Convenções de desenvolvimento, estrutura visual de CSS Modules e diretrizes de ML Ops.

### 🔌 APIs e Integrações
- **[Referência da API](./api-reference.md):** Documentação detalhada dos endpoints, payloads de entrada/saída, tratamento de erros e autenticação baseada em API Key.

### 💻 Guias do Desenvolvedor (`docs/developer/`)
- **[Arquitetura do Cliente](./developer/client-architecture.md):** Estrutura interna do frontend React (hooks, componentes do simulador, mocks de fallback).
- **[Configurações do Cliente](./developer/client-config.md):** Detalhamento das ferramentas de build (Vite), compiladores (tsconfig) e dependências (package.json).
- **[Mapeamento de Modelos](./developer/model-mapping.md):** Explicação da convenção de nomenclatura dos arquivos de pesos `.keras` e escaladores `.pkl` do IBGE/NCM.
- **[Notas Técnicas e Validação Científica](./developer/technical-notes.md):** Análise do pipeline de ML, logs de auditoria e validação da tese acadêmica aplicada na Indústria 4.0.

### 📈 Propostas e Planejamento
- **[Proposta: Fluxo de Dados Multivariado](./proposals/multivariate-workflow.md):** Planejamento da integração de novas variáveis exógenas (clima e tráfego da BR-174) no modelo LSTM.
- **[Plano de Migração de Banco de Dados](./plans/db-migration.md):** Checklist detalhado da migração de SQLite para PostgreSQL.
- **[Estratégia de Escalabilidade](./plans/scaling-strategy.md):** Roadmap de longo prazo para dockerização, cache com Redis, mensageria (Celery/RabbitMQ) e TF Serving.

### 📑 Relatórios, Pesquisas e Histórico
- **[Artigo Científico Acadêmico](./academic/analise-comparativa-arima-lstm.pdf):** Pesquisa de mestrado comparativa entre ARIMA e LSTM que fundamenta o motor preditivo do Nexus.
- **[Relatório de Status v1.3.1](./reports/status-report-v1.3.1.md):** Detalhes da entrega de hardening de segurança e infraestrutura Docker/PostgreSQL.
- **[Listas de Tarefas de Documentação](./todos/documentation.md):** Controle de tarefas e pendências de documentação.
- **[Arquivo de Documentação v1.0](./archive/v1.0/README.md):** Versão inicial da documentação histórica do MVP.

---

*ArcoNorte Nexus: Da previsão à decisão logística.*
