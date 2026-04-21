# ArcoNorte Nexus Documentation

Bem-vindo à documentação oficial do **ArcoNorte Nexus**, uma plataforma de Inteligência Logística focada na predição de escoamento de grãos no Arco Norte brasileiro (com foco primário no Porto Seco de Roraima).

## 📚 Conteúdo

- [Documentação v2.0 (Abril 2026)](./2026-04-21/README.md) - **Versão Atual**
- [Visão Geral do Projeto](./project-overview.md): Objetivos, visão estratégica e roadmap (v1.0).
- [Arquitetura do Sistema](./system-architecture.md): Detalhamento técnico do Frontend, Backend e Pipeline de Machine Learning (v1.0).
- [Referência da API](./api-reference.md): Endpoints, payloads e exemplos de integração (v1.0).
- [Padrões de Código](./code-standards.md): Convenções de desenvolvimento e padrões arquiteturais (v1.0).
- [Resumo do Codebase](./codebase-summary.md): Guia rápido sobre a estrutura de arquivos e diretórios (v1.0).

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Python 3.9+
- Venv (Recomendado)

### Executando o Backend
```bash
cd api
python -m venv venv
source venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
uvicorn main:app --reload
```

### Executando o Frontend
```bash
npm install
npm run dev
```

---
*Documentação gerada para o ArcoNorte Nexus. Da previsão à decisão.*
