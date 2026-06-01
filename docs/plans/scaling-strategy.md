# Estratégia de Escalabilidade da Plataforma

Este documento descreve os objetivos, o roadmap de infraestrutura e a evolução de stack planejados para suportar o crescimento do ArcoNorte Nexus.

---

## 🎯 Objetivos de Negócio e Engenharia
1. **Escala de Usuários:** Suportar mais de 100 usuários corporativos simultâneos sem degradação de performance.
2. **Latência de Inferência:** Garantir tempo de resposta de inferência menor que 200ms.
3. **Disponibilidade:** Implementar infraestrutura com alta disponibilidade (99.9% de uptime).

---

## 🗺️ Roadmap de Evolução

### Curto Prazo
**Foco:** Contêineres e Cache
* [ ] Dockerização total da aplicação (Frontend + Backend + ML Worker).
* [ ] Implementação de Redis para cache de resultados do `IPEEngine`.
* [ ] Centralização de logs e monitoramento (Sentry + Prometheus).

### Médio Prazo
**Foco:** IA Desacoplada e Async
* [ ] Migração para TensorFlow Serving para servir os modelos `.keras` de forma isolada.
* [ ] Introdução de Celery + RabbitMQ para lidar de forma assíncrona com tarefas pesadas (ex: exportação de relatórios densos).
* [ ] Configuração de pipeline de CI/CD (GitHub Actions) contendo testes automatizados de regressão para IA.

### Longo Prazo
**Foco:** Distribuição Global e DaaS (Data-as-a-Service)
* [ ] Implementação de suporte a multi-tenancy (isolamento lógico por parceiro/SEFAZ).
* [ ] Exposição de uma API pública oficial através de um API Gateway para o modelo DaaS.
* [ ] Distribuição de recursos estáticos via CDN para redução de latência geográfica no frontend.

---

## 🥞 Evolução da Stack Tecnológica

| Componente | Stack Atual | Stack Alvo |
|---|---|---|
| **Banco de Dados** | SQLite | PostgreSQL |
| **Execução da API** | FastAPI (Sync) | FastAPI (Async) |
| **Cache & Filas** | N/A | Redis |
| **Model Serving** | Keras (In-memory) | TF Serving |
| **Orquestração** | Manual / Local | Docker Swarm / Kubernetes (K8s) |
