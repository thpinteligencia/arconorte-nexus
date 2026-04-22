# Arquitetura do Sistema: ArcoNorte Nexus (v2.0)

## 🏗️ Visão Geral Técnica
O sistema evoluiu para uma arquitetura desacoplada onde o processamento pesado e a inteligência de dados residem inteiramente no Backend, enquanto o Frontend foca na visualização e interação do usuário.

### 🎨 Frontend (React + CSS Modules)
- **Framework:** React 18 com TypeScript.
- **Estilização:** Transição para **CSS Modules** para evitar colisões de estilo e aumentar a manutenibilidade, mantendo o Tailwind CSS para utilitários globais.
- **Visualização:** `recharts` integrado diretamente com o payload do `IPEEngine`.

### ⚡ Backend (FastAPI + IPE Logic)
- **Framework:** FastAPI gerenciando o ciclo de vida da aplicação.
- **PredictorService:** Serviço centralizado que gerencia o cache de modelos Micro-LSTM e executa o rollout recursivo para predições de 12 meses.
- **IPEEngine:** Motor lógico que unifica as predições de Soja e calcula o Índice de Pressão de Escoamento em tempo real.
- **Model Registry:** Uso do `model_registry.json` como fonte da verdade para localização de arquivos `.keras` e `.pkl`, permitindo atualizações dinâmicas de modelos sem alteração no código fonte.

## 🧠 Pipeline de Machine Learning & Gestão de Ativos
A inteligência do sistema agora é gerenciada dinamicamente:

1.  **Registro Dinâmico:** O backend lê o `model_registry.json` para saber quais UFs e NCMS possuem modelos ativos.
2.  **Inference Engine:** O `PredictorService` carrega os modelos sob demanda (lazy loading) e os mantém em cache.
3.  **Sanity Check:** Cada modelo no registro possui metadados de `max_tons_sanity` para evitar anomalias estatísticas na predição.
4.  **Consumo de Dados:** Integração robusta com o `ComexStat` para buscar os últimos 6 meses de dados reais como semente para a predição LSTM.

## 🔄 Fluxo de Integração Real

```ascii
┌──────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Frontend    │      │   FastAPI    │      │    ComexStat    │
│ (CSS Modules)│◀────▶│ (Main Entry) │◀────▶│ (Raw Data API)  │
└──────────────┘      └──────────────┘      └─────────────────┘
                             │
                             ▼
                      ┌────────────────┐      ┌─────────────────┐
                      │ PredictorServ. │◀────▶│ Model Registry  │
                      │ (LSTM Inference)│      │ (JSON Config)   │
                      └────────────────┘      └─────────────────┘
                             │
                             ▼
                      ┌────────────────┐
                      │   IPE Engine   │
                      │ (Logic/Metrics)│
                      └────────────────┘
```

## 📂 Organização de Artefatos
Os arquivos de modelo agora seguem uma convenção rigorosa mapeada no registro:
- `api/artifacts/model_{NCM}_{UF}.keras`
- `api/artifacts/scaler_{NCM}_{UF}.pkl`
