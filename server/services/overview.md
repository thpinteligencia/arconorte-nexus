A pasta **`server/services`** abriga a camada de **regras de negócio e serviços auxiliares** do backend da aplicação. Ela organiza e isola a lógica de domínio de dados, inteligência artificial, cálculos operacionais e relatórios.

Aqui estão os serviços presentes nesta pasta e o que cada um faz:

### 1. **`comex_service.py`**
* **O que faz**: Gerencia a ingestão de dados estatísticos de comércio exterior.
* **Detalhes**:
  * Realiza requisições HTTP para a API oficial do MDIC (ComexStat) para buscar dados de exportação em quilogramas (`kg`) e valor comercial (`fob`).
  * Implementa uma lógica de **tentativa de repetição (retry)** com tempo de espera incremental para lidar de forma segura com o *Rate Limit* (Erro HTTP 429) da API do governo.
  * Realiza a mesclagem automática dos dados vivos da API com o cache local (`server/data/comex_cache.json`) para evitar tráfego de rede desnecessário e servir como *fallback* caso a API do governo esteja fora do ar.

### 2. **`ipe_engine.py`**
* **O que faz**: Motor de cálculo do **IPE** (Índice de Pressão sobre o Escoamento).
* **Detalhes**:
  * Recebe as predições de volume de soja geradas pelo modelo e as unifica com a capacidade logística/porto configurada.
  * Calcula mês a mês o percentual de pressão sobre o escoamento logístico (razão entre o volume total previsto e a capacidade instalada) e determina o pico máximo do IPE no ano projetado.

### 3. **`predictor_service.py`**
* **O que faz**: Executa as previsões de inteligência artificial.
* **Detalhes**:
  * Implementa a classe `PredictorService` com um **cache em memória** para os modelos (`.keras`) e escaladores (`.pkl`), garantindo que os arquivos binários não precisem ser recarregados do disco a cada requisição.
  * Executa o algoritmo de **Rollout Recursivo** de 12 meses: a predição gerada para o mês $T+1$ é retroalimentada como entrada na janela temporal (*lookback*) para prever o mês $T+2$, e assim sucessivamente.
  * Executa verificações de sanidade dinâmica (`max_tons_sanity`) e, caso seja passada uma sessão de banco de dados, registra automaticamente os dados de entrada e saída no banco (`InferenceLog`) para fins de auditoria de IA.

### 4. **`reporting_service.py`**
* **O que faz**: Geração de relatórios analíticos em PDF.
* **Detalhes**:
  * Carrega os templates HTML estratégicos utilizando a biblioteca de renderização **Jinja2** (localizados na pasta `server/templates/`).
  * Mescla os dados preditos e o IPE calculado no template HTML e compila o resultado diretamente para um arquivo **PDF** em memória usando a biblioteca **WeasyPrint**, permitindo que o usuário faça o download do boletim exportado instantaneamente.

### Resumo da Pasta
`server/services` é onde a mágica das regras de negócio acontece: ela busca dados reais (`comex_service`), roda as predições de IA (`predictor_service`), calcula os indicadores operacionais (`ipe_engine`) e gera os documentos de exportação de dados (`reporting_service`).