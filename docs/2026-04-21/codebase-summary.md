# Resumo do Codebase: ArcoNorte Nexus (v2.0)

## 📂 Estrutura de Diretórios

### `/api` (Backend Python)
- `main.py`: Entry point com rotas v1.
- `/artifacts`: Modelos e Scalers de IA.
- `/data/model_registry.json`: Registro central de modelos por UF/NCM.
- `/services/predictor_service.py`: Coração da inferência LSTM.
- `/services/ipe_engine.py`: Motor unificado de métricas logísticas.
- `/services/comex_service.py`: Coletor de dados dinâmicos do ComexStat.

### `/src` (Frontend React)
- `App.tsx`: Orquestrador principal (usa CSS Modules).
- `App.module.css`: Estilos encapsulados para o layout principal.
- `/components`: Componentes de UI refatorados.
- `/constants`: Definição de nomes de UFs e NCMS.

---

## 🔑 Fluxo de Verdade (SSoT)

1. **Dados de Entrada:** O `model_registry.json` define o que é possível prever.
2. **Processamento:** O `PredictorService` transforma histórico em futuro via LSTM.
3. **Métricas:** O `IPEEngine` transforma futuro em decisões (IPE %).
4. **Visualização:** O Frontend consome o `/predict/soja` e renderiza via CSS Modules.

---
*Este resumo reflete a estrutura da Fase 2 (Abril 2026).*
