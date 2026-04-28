# 🚀 Plano de Action: ArcoNorte Nexus

**Visão Geral:** Transformar o estudo preditivo (Micro-LSTM) focado no escoamento de soja no Arco Norte em uma **Plataforma de Inteligência Logística** (ArcoNorte Nexus). Foco total na Soja para validação da tese DaaS antes da expansão para outros grãos.

---

## 🏁 Fase 1: O "Efeito UAU" (MVP Frontend) - *[CONCLUÍDO]*
**Objetivo:** Criar um ativo visual de alto impacto para apresentar o conceito a stakeholders.

---

## ⚙️ Fase 2: O Motor Nexus (Resiliência & IA Real) - *[CONCLUÍDO]*
**Objetivo:** Substituir dados mockados por inferência LSTM real e ingestão de dados vivos.

---

## 📊 Fase 3: Inteligência Institucional (Data-as-a-Service) - *[CONCLUÍDO]*
**Objetivo:** Estabelecer a empresa como autoridade em dados logísticos através de entregáveis tangíveis.

---

## 🛡️ Fase 4: Hardening & Infraestrutura (Segurança e Persistência) - *[EM CURSO]*
**Objetivo:** Eliminar débitos técnicos e blindar o sistema para produção real com parceiros externos.

1.  **Segurança de Credenciais:** ✅ Migração de API Keys do Frontend para injeção via Proxy (Vite/Nginx). Remoção de fallbacks expostos.
2.  **Gestão de Sessão:** ✅ Refatoração do `PredictorService` para injeção de dependência do SQLAlchemy, garantindo fechamento correto de sessões.
3.  **Migração PostgreSQL (v1.3.1):** ✅ Implementação de suporte a Postgres, docker-compose para infra e suporte a DATABASE_URL.
4.  **CORS & Proxy:** ✅ Restrição de origens e fechamento de endpoints sensíveis.

---

## 🚀 Fase 5: Expansão e Monitoramento Ativo (Longo Prazo)
**Objetivo:** Tornar o ArcoNorte Nexus o sistema de navegação definitivo para o agronegócio.

*   **A Trinca de Grãos:** Inclusão de modelos preditivos para Milho (NCM 10059010) e Arroz (NCM 10061092).
*   **Retraining Automático:** Pipeline de MLOps para atualização de pesos dos modelos com base nos novos dados do COMEX.
*   **Simulador de Cenários:** Interface para comparação de "Real vs. Projetado" com ajustes de variáveis exógenas.

---
*Documento atualizado em 24 de Abril de 2026. Status: Hardening Concluído (v1.3.1).*
