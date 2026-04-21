# Padrões de Código: ArcoNorte Nexus

## 🛠️ Filosofia de Desenvolvimento
Priorizamos código legível, modular e fortemente tipado. O objetivo é manter a manutenibilidade enquanto lidamos com modelos complexos de ML e visualizações densas de dados.

## 🐍 Python (Backend)
- **Framework:** FastAPI.
- **Estilo:** Seguir o [PEP 8](https://www.python.org/dev/peps/pep-0008/).
- **Tipagem:** Utilizar *Type Hints* em todas as funções e métodos.
- **Validação:** Pydantic para todos os esquemas de entrada/saída da API.
- **ML Ops:** Modelos devem ser carregados via `PredictorService` (padrão Singleton) para evitar recarregamentos desnecessários em cada request.

## ⚛️ React & TypeScript (Frontend)
- **Componentes:** Preferir Componentes Funcionais com Hooks.
- **Estilização:** Tailwind CSS (evitar CSS puro ou Styled Components, a menos que seja estritamente necessário).
- **Nomenclatura:**
  - Componentes: `PascalCase` (ex: `DashboardCard.tsx`).
  - Funções/Variáveis: `camelCase`.
  - Constantes: `UPPER_SNAKE_CASE`.
- **Props:** Definir interfaces TypeScript para todas as props de componentes.

## 📂 Organização de Arquivos
- **Surgical Updates:** Ao modificar arquivos grandes, use ferramentas de substituição precisa em vez de sobrescrever o arquivo inteiro.
- **Clean Imports:** Agrupar imports por (1) bibliotecas externas, (2) bibliotecas internas do projeto, (3) tipos/interfaces.

## 🧪 Testes e Validação
- **Backend:** Testes unitários para lógica de cálculo do IPE e integração da API.
- **Frontend:** Verificar integridade visual e funcional dos gráficos após mudanças no backend.

---
*Manter o padrão é garantir a escalabilidade.*
