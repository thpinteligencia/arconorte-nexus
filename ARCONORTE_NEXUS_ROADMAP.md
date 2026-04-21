# 🚀 Plano de Ação: ArcoNorte Nexus

**Visão Geral:** Transformar o estudo preditivo (Micro-LSTM) focado no escoamento de soja no Arco Norte em uma **Plataforma de Inteligência Logística** (ArcoNorte Nexus). Foco total na Soja para validação da tese DaaS antes da expansão para outros grãos.

---

## 🏁 Fase 1: O "Efeito UAU" (MVP Frontend) - *[CONCLUÍDO]*
**Objetivo:** Criar um ativo visual de alto impacto para apresentar o conceito a stakeholders.

*   **Identidade Visual:** Aplicação das *Brand Guidelines* (Grafite Profundo, Verde Soja).
*   **Dashboard Operacional:** IPE Badge dinâmico e Horizonte Preditivo de 12 meses.
*   **Refatoração de Escala:** Migração concluída para **CSS Modules** para suporte a crescimento modular.

---

## ⚙️ Fase 2: O Motor Nexus (Resiliência & IA Real) - *[CONCLUÍDO]*
**Objetivo:** Substituir dados mockados por inferência LSTM real e ingestão de dados vivos.

1.  **Arquitetura Base:** Setup de **FastAPI** com serviços desacoplados (`PredictorService`, `IPEEngine`).
2.  **Ingestão Resiliente:** Coleta automática via API **ComexStat** com **Retry Logic & Exponential Backoff**.
3.  **Pipeline de IA:** Rollout Recursivo de 12 meses via modelos Micro-LSTM reais e gestão via `model_registry.json`.

---

## 📊 Fase 3: Inteligência Institucional (Data-as-a-Service) - *[CONCLUÍDO]*
**Objetivo:** Estabelecer a empresa como autoridade em dados logísticos através de entregáveis tangíveis.

*   **Geração de Relatórios (Nexus Reporting):** Implementação server-side (WeasyPrint) do "Boletim Estratégico Mensal" em PDF.
*   **Audit Trail:** Persistência em banco relacional (SQLite + SQLAlchemy + Alembic) para rastrear acurácia (`RMSE`, `MAE`) e logs de inferência.
*   **Nexus API Public:** Documentação profissional via **ReDoc** e proteção via **API Keys** (`X-API-Key`).

---

## 🛠️ Fase 4: Refino & Hardening (Segurança e Arquitetura) - *[PRÓXIMO PASSO]*
**Objetivo:** Eliminar débitos técnicos e blindar o sistema para produção real com parceiros externos.

*   **Segurança de Credenciais:** Migrar API Keys do Frontend para variáveis de ambiente (`.env`) e implementar proxy reverso para ocultar chaves em chamadas internas.
*   **Injeção de Dependência:** Refatorar o `PredictorService` para gerenciar sessões de banco via `Depends(get_db)`, evitando possíveis leaks de conexão.
*   **Infraestrutura de Deploy:** Documentar e validar dependências de SO (`pango`, `cairo`, `gdk-pixbuf`) para garantir portabilidade do gerador de PDF.

---

## 🌍 Fase 5: Expansão e Monitoramento Ativo (Longo Prazo)
**Objetivo:** Tornar o ArcoNorte Nexus o sistema de navegação definitivo para o agronegócio.

*   **A Trinca de Grãos:** Inclusão de modelos preditivos para Milho (NCM 10059010) e Arroz (NCM 10061092).
*   **Variáveis Exógenas:** Integração de dados climáticos (El Niño) e status de infraestrutura (BR-174).
*   **Integração ERP/YMS:** Conexão direta com sistemas de pátio para automação de agendamentos.

---
*Documento atualizado em 21 de Abril de 2026. Foco: Soja | Status: Fase 3 Completa.*
