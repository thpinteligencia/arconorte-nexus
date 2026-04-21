# Visão Geral do Projeto: ArcoNorte Nexus

## 📋 Resumo
O **ArcoNorte Nexus** é uma plataforma de inteligência voltada para o setor de agronegócio e logística. Ele transforma dados complexos de exportação (ComexStat) e modelos de Deep Learning (LSTM) em insights acionáveis para gestão portuária e escoamento de safras.

## 🎯 Objetivos Principais
1.  **Predição de Volume:** Prever o fluxo de exportação de Soja com antecedência de 12 meses. (Milho e Arroz: roadmap Fase 3)
2. **Índice de Pressão de Escoamento (IPE):** Identificar períodos de gargalo logístico com base na capacidade estática do Porto Seco.
3. **Simulação de Cenários:** Permitir que gestores simulem variações na safra e vejam o impacto imediato na logística estadual.

## 🗺️ Roadmap Estratégico

### Fase 1: MVP Frontend (Concluído)
- Desenvolvimento da UI baseada em React.
- Dashboards interativos e simuladores com dados simulados.
- Definição da identidade visual "Modern Agro".

### Fase 2: Motor Preditivo (Concluído - Atualizado em 21/04/2026)
- Integração do backend FastAPI de alta performance.
- Implementação do `PredictorService` com Rollout Recursivo.
- Cálculo de SSoT (Single Source of Truth) para o IPE via `IPEEngine`.
- Refatoração do Frontend para uso de **CSS Modules**, garantindo isolamento de estilos.
- Gestão centralizada de ativos de IA via `model_registry.json`.

### Fase 3: Inteligência de Mercado (Futuro)
- Geração automática de relatórios em PDF.
- Dashboards de acurácia de modelo (RMSE/MAE).
- Expansão para mapeamento geoespacial de fluxos rodoviários.

## 👥 Stakeholders
- Gestores de Portos Secos e Terminais Logísticos.
- Aprosoja (Associação dos Produtores de Soja).
- SEFAZ e órgãos de planejamento estadual.
- Tradings e empresas exportadoras.
