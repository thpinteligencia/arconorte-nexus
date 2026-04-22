# ArcoNorte Nexus Documentation (v2.0)

Esta pasta contém a documentação atualizada para a **Fase 2** do projeto ArcoNorte Nexus, consolidada em **21 de Abril de 2026**.

## 📚 Conteúdo Atualizado

- [Visão Geral do Projeto](./project-overview.md): Evolução para o Motor Preditivo Real.
- [Arquitetura do Sistema](./system-architecture.md): Detalhes sobre `PredictorService`, `IPEEngine` e CSS Modules.
- [Referência da API](./api-reference.md): Guia do novo endpoint `/api/v1/predict/soja`.
- [Padrões de Código](./code-standards.md): Novas diretrizes para CSS Modules e ML Ops.
- [Resumo do Codebase](./codebase-summary.md): Mapa da estrutura v2.0.

## 🚀 O que mudou na Fase 2?

1. **Inteligência Real:** Saímos de dados simulados para inferência LSTM baseada em modelos reais de cada UF.
2. **Isolamento de Estilos:** Refatoração do frontend para CSS Modules, garantindo escalabilidade visual.
3. **Gestão Dinâmica de IA:** Introdução do `model_registry.json` para facilitar o deploy de novos modelos sem downtime.
4. **Backend Robusto:** Lógica de negócio agora centralizada em `Services` no FastAPI.

---
*ArcoNorte Nexus: Da Previsão à Decisão Logística.*
