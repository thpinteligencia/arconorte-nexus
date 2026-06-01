A pasta **`src/components/Dashboard`** é o diretório do frontend (desenvolvido em **React com TypeScript**) que armazena os componentes de interface que estruturam o painel de visualização preditiva e simulação. 

Ela contém os seguintes componentes:

### 1. **`AuditPanel.tsx`**
* **O que faz**: Painel dedicado à exibição de métricas de auditoria e performance da IA.
* **Detalhes**:
  * Consome o endpoint do backend `GET /api/v1/audit/metrics` autenticando-se com o cabeçalho `X-API-Key`.
  * Renderiza a acurácia dos modelos por Estado (UF) e Código Fiscal (NCM), apresentando os valores estatísticos de **RMSE** e **MAE**.
  * Apresenta uma caixa com a contagem total de inferências efetuadas no backend.
  * Renderiza uma tabela contendo os logs de execução recentes com data e hora (*timestamp*), UF, NCM, multiplicador aplicado e status de sucesso.

### 2. **`IpeCard.tsx`**
* **O que faz**: Cartão de visualização do **IPE** (Índice de Pressão de Escoamento).
* **Detalhes**:
  * Renderiza um indicador visual dinâmico em formato de **velocímetro (gauge)** que rotaciona o ponteiro conforme o percentual do IPE atual.
  * Modifica a cor do preenchimento do velocímetro em tempo real chamando a função de apoio `getIPEColor(ipe)`.
  * Renderiza barras de progresso que mostram a divisão da pressão logística por cultura (Soja).
  * Exibe dinamicamente o status operacional ("OPERACIONAL" ou "SATURADO" caso o IPE ultrapasse 90%).

### 3. **`PredictionChart.tsx`**
* **O que faz**: Gráfico de área interativo mostrando a linha do tempo preditiva de 12 meses.
* **Detalhes**:
  * Utiliza a biblioteca **Recharts** para desenhar um gráfico de área sombreado (`AreaChart`) que plota os volumes mensais de soja projetados pelo backend.
  * Exibe um aviso visual importante de que a acurácia decresce progressivamente devido à técnica de **Rollout Recursivo** utilizada para previsões de longo prazo.
  * Oferece interatividade clássica como tooltips sob medida para exibir dados detalhados ao passar o mouse sobre cada mês.

### 4. **`SimulatorPanel.tsx`**
* **O que faz**: Painel lateral contendo os controles de simulação.
* **Detalhes**:
  * Renderiza sliders interativos (inputs do tipo `range`) para manipular:
    * O multiplicador de volume da safra de soja (variando de 50% a 300%).
    * A capacidade instalada do porto/terminal (variando de 20k a 500k toneladas).
  * Permite resetar as variáveis aos valores padrão.
  * Oferece o botão **"Gerar Boletim"** para fazer o download do PDF estratégico via `onDownloadReport`, gerenciando os estados visuais de carregamento e travamento de controles (`isVolLocked`, `isCapLocked`, `isReportLocked`).

### Resumo da Pasta
Em suma, `src/components/Dashboard` agrupa todas as partes modulares da interface que dão vida ao painel de inteligência logística, permitindo que o usuário visualize os dados preditivos históricos da IA, faça simulações de cenários sob estresse logístico e audite a saúde dos modelos.