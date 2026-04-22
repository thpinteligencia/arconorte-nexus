# Padrões de Código: ArcoNorte Nexus (v2.0)

## 🐍 Python (Backend)
- **Framework:** FastAPI.
- **Serviços:** Lógica de negócio deve ser encapsulada em classes Service (ex: `PredictorService`).
- **Data Persistence:** O arquivo `model_registry.json` é a fonte da verdade para ativos de ML. Nunca hardcodear caminhos de modelos.
- **Tipagem:** Uso obrigatório de *Type Hints* e modelos Pydantic para validação de contratos de API.

## ⚛️ React & TypeScript (Frontend)
- **Estilização:** **CSS Modules** é o padrão obrigatório para novos componentes.
  - Arquivo: `NomeComponente.module.css`.
  - Uso: `import styles from './Nome.module.css'`.
- **CSS Global:** Reservado apenas para variáveis de tema (`:root`) e resets básicos.
- **Componentes:** Devem ser funcionais, utilizando Hooks e seguindo o princípio de responsabilidade única.

## 📂 Organização de Arquivos
- **Artefatos:** Modelos `.keras` e `.pkl` devem ser salvos em `api/artifacts/` e registrados em `api/data/model_registry.json`.
- **Imports:** Manter imports limpos e organizados por categoria.

## 🧠 Boas Práticas de ML Ops
- **Lazy Loading:** Modelos devem ser carregados apenas quando solicitados e mantidos em cache no Singleton do `PredictorService`.
- **Sanity Checks:** Implementar limites físicos (baseados no histórico da UF) para evitar predições irreais em cenários de simulação extrema.

---
*Escalabilidade com rigor técnico.*
