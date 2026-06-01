# Arquitetura do Sistema: ArcoNorte Nexus

## 🏗️ Visão Geral Técnica
O sistema utiliza uma arquitetura cliente-servidor moderna, separando claramente a camada de visualização (Frontend) da camada de processamento pesado e inferência de IA (Backend).

### 🎨 Frontend (React + Vite)
- **Framework:** React 18 com TypeScript para tipagem forte.
- **Estilização:** Tailwind CSS para design responsivo e `lucide-react` para ícones.
- **Visualização de Dados:** `recharts` para gráficos de área, barras e linhas.
- **Estado Global:** Hooks nativos do React (Context API se necessário).

### ⚡ Backend (FastAPI + Python)
- **Framework:** FastAPI para APIs de alta performance com tipagem via Pydantic.
- **Inference Engine:** TensorFlow/Keras para carregamento e execução de modelos Micro-LSTM.
- **Data Fetcher:** Módulo customizado para ingestão de dados via API do ComexStat.
- **Middleware:** CORS habilitado para comunicação segura com o frontend.

## 🧠 Pipeline de Machine Learning
O núcleo preditivo do sistema baseia-se no modelo **Micro-LSTM** desenvolvido para o artigo ECAI.

1.  **Ingestão de Dados:** O sistema consome dados de exportação mensais filtrados por UF (Unidade Federativa) e NCM (Nomenclatura Comum do Mercosul).
2.  **Pré-processamento:** Normalização dos dados via `MinMaxScaler` (arquivos `.pkl` nos artefatos).
3.  **Inferência:** Execução do modelo `.keras` para prever os próximos meses de exportação.
4.  **Pós-processamento:** Des-normalização dos resultados e agregação com a lógica do **IPE (Índice de Pressão de Escoamento)**.

## 🔄 Fluxo de Dados

```ascii
┌─────────────┐     ┌─────────────┐     ┌────────────────┐
│   Frontend  │────▶│   FastAPI   │────▶│   ComexStat    │
│   (React)   │◀────│   (Python)  │◀────│   (Data Source)│
└─────────────┘     └─────────────┘     └────────────────┘
                           │                   ▲
                           ▼                   │
                    ┌────────────────┐  ┌─────────────┐
                    │  ML Predictor  │  │   SQLite    │
                    │  (LSTM Models) │  │   (Cache)   │
                    └────────────────┘  └─────────────┘
```

## 📂 Organização de Artefatos
Os modelos e scalers são versionados no diretório `api/artifacts/`, garantindo que o backend tenha as versões corretas para cada UF e NCM.
