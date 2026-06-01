### 1. O que é a pasta `client/src`?
Esta pasta contém o **código-fonte do frontend (client-side)** da aplicação. Ela foi desenvolvida utilizando **React (com TypeScript e TSX)** e usa o **Vite** como empacotador (bundler). 

O objetivo principal desta interface é o **Simulador Estratégico do Arco Norte**, uma ferramenta visual para analisar e simular o escoamento logístico de soja nos estados do Arco Norte (Roraima, Amazonas, Pará e Mato Grosso).

---

### 2. Estrutura de Diretórios e Arquivos

*   **`main.tsx`**: O ponto de entrada da aplicação React. Ele monta a árvore de componentes no elemento root do HTML.
*   **`App.tsx` & `App.module.css`**: O componente principal da aplicação. Controla o layout global (Sidebar, Header e conteúdo das abas) e gerencia qual tela/aba está ativa (Painel de Controle, Auditoria ou Relatórios).
*   **`components/`**: Onde ficam os blocos reutilizáveis de interface:
    *   `layout/`: Estrutura base da página (como o `Sidebar`, `Header` e o `TutorialOverlay`).
    *   `dashboard/`: Componentes específicos da tela principal (como `IpeCard` para exibir o Índice de Pressão de Escoamento, `PredictionChart` para os gráficos e `SimulatorPanel` para os inputs de simulação).
    *   `common/`: Componentes genéricos de UI reutilizáveis.
*   **`hooks/`**: Concentra a lógica de estado de forma desacoplada dos componentes (ótima prática fullstack):
    *   `useSimulator.ts`: Gerencia o estado dos inputs (volume de soja, capacidade do porto, UF selecionada), faz requisições à API e lida com o fallback para mock se o backend falhar.
    *   `useTutorial.ts`: Gerencia os passos do tutorial interativo.
*   **`utils/`**: Funções utilitárias e dados mockados (em `mockData.ts`) que permitem rodar a interface e simular dados mesmo se o backend estiver fora do ar.
*   **`types/`**: Definições de tipos do TypeScript (interfaces como `PredictionData` e `ChartDataItem`), garantindo tipagem estática e evitando erros em tempo de execução.
*   **`constants/`**: Valores estáticos compartilhados, como o mapeamento de IDs para os nomes dos estados (`UFS_NAMES`).
*   **`styles/` & `index.css`**: Configuração do sistema de design, cores, fontes (como Inter/Roboto) e classes utilitárias globais (ex: efeito glassmorphism e animações suaves).

---

### 3. O que a aplicação faz (Fluxo de Funcionamento)

Do ponto de vista de arquitetura de dados e comunicação, o cliente realiza três principais integrações com o backend:

1.  **Carregamento de Registros (`/api/v1/registry`)**: Ao iniciar, busca quais estados estão disponíveis para a simulação. Se falhar, usa uma lista estática.
2.  **Simulação Logística (`/api/v1/predict/soja`)**: Sempre que o usuário altera os inputs (como volume de soja ou capacidade do porto), o hook `useSimulator` dispara uma requisição `POST` com debounce (atraso de 500ms para evitar chamadas excessivas) para o backend rodar o motor Nexus de predição. O resultado atualiza o gráfico e o indicador IPE na tela.
3.  **Geração de Boletim PDF (`/api/v1/report/pdf`)**: Permite que o usuário exporte a simulação corrente gerando um PDF oficial diretamente a partir do motor do backend.

---

### Resumo das Atividades
*   Analisei a estrutura de diretórios do frontend (`client/src`).
*   Expliquei o fluxo de funcionamento e como a lógica de simulação se comunica com a API do backend (`/api/v1/...`).
*   Identifiquei as tecnologias utilizadas (React, Vite, TS, CSS Modules).