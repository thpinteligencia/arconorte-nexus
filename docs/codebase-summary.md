# Resumo do Codebase: ArcoNorte Nexus

## 📂 Estrutura de Diretórios

### `/api` (Backend Python)
O coração lógico do sistema.
- `main.py`: Ponto de entrada da API FastAPI.
- `/artifacts`: Armazena modelos `.keras` e scalers `.pkl`.
- `/core`: Motores de processamento e treinamento.
- `/data`: Cache de dados e registros de modelos.
- `/services`: Serviços de negócio (Predição, Comex, IPE).
- `/utils`: Funções auxiliares (Calendários de safra).

### `/src` (Frontend React)
Interface de usuário moderna e responsiva.
- `App.tsx`: Componente principal que orquestra os Dashboards.
- `main.tsx`: Entry point do React.
- `index.html`: Template base.

### `/docs` (Documentação)
Repositório central de conhecimento do projeto.

---

## 🔑 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `api/main.py` | Define as rotas da API e orquestra os serviços. |
| `api/services/predictor_service.py` | Lógica de carregamento de modelos e inferência ML. |
| `api/services/comex_service.py` | Integração com a API do ComexStat para dados vivos. |
| `src/App.tsx` | Contém toda a lógica visual, gráficos e simulador. |
| `vite.config.ts` | Configuração do bundler Vite e plugins React. |
| `package.json` | Dependências e scripts do frontend. |
| `ARCONORTE_NEXUS_ROADMAP.md` | Guia estratégico de evolução do produto. |

---
*Este resumo deve ser atualizado sempre que houver grandes mudanças estruturais.*
