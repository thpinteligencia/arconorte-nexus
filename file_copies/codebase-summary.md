# Resumo do Codebase: ArcoNorte Nexus (v2.0)

Este documento descreve a estrutura física do código e o fluxo de dados unificado na plataforma.

---

## 📂 Estrutura de Diretórios Real

### ⚡ `/server` (Backend Python - FastAPI)
Contém toda a lógica preditiva, tratamento de dados governamentais e serviços da API.
- **`main.py`:** Ponto de entrada da API contendo as rotas `/predict/soja`, `/registry` e `/report/pdf`.
- **`/artifacts`:** Arquivos binários de modelos (`.keras`) e escaladores (`.pkl`).
- **`/data`:** Cache local do ComexStat (`comex_cache.json`) e banco de dados SQLite (`nexus.db`).
- **`/data/model_registry.json`:** Registro central de modelos ativos, servindo como Single Source of Truth (SSoT) para os metadados de UFs/NCMs.
- **`/services`:**
  - `predictor_service.py`: Coração da inferência LSTM (com rollout recursivo de 12 meses).
  - `ipe_engine.py`: Motor unificado de cálculo de Índice de Pressão de Escoamento (IPE %).
  - `comex_service.py`: Coletor e cacheador de dados históricos do ComexStat.
  - `reporting_service.py`: Geração automatizada de boletins logísticos em PDF.
- **`/db`:** Configuração do SQLAlchemy e conexão com o banco (SQLite/PostgreSQL).
- **`/core`:** Motores internos e scripts de treinamento.

### 🎨 `/client` (Frontend React - Vite + TS)
Interface de usuário moderna estruturada sob o ecossistema React.
- **`src/App.tsx`:** Componente central que gerencia o estado das abas e layout geral da plataforma.
- **`src/App.module.css`:** Estilização encapsulada (CSS Modules) para evitar vazamentos de escopo de estilo.
- **`src/components/`:** Subdividido em `layout/` (Sidebar, Header), `dashboard/` (SimulatorPanel, IpeCard, PredictionChart) e `common/` (botões e modais reutilizáveis).
- **`src/hooks/`:** Lógica de negócio isolada, incluindo `useSimulator.ts` (requisições de predição e fallback mock) e `useTutorial.ts` (passos interativos).
- **`src/utils/`:** Utilitários de gráficos e base de mock data (`mockData.ts`).
- **`src/types/`:** Definições estáticas do TypeScript.

---

## 🔑 Fluxo de Verdade (SSoT)

```
[model_registry.json] ➔ Define o que está disponível para o sistema
          │
          ▼
[PredictorService]   ➔ Lê a semente do ComexStat e projeta 12 meses via LSTM
          │
          ▼
[IPEEngine]          ➔ Converte projeção de volume em Índice de Pressão (%)
          │
          ▼
[React Frontend]     ➔ Consome a API e renderiza via CSS Modules
```

---
*Este resumo reflete a estrutura exata do repositório a partir da Fase 2 (Abril 2026).*
