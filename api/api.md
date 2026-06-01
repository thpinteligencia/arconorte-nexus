A pasta api/data e o arquivo contido nela (model_registry.json) desempenham o papel de registro central de metadados dos modelos de Inteligência Artificial (Machine Learning/Deep Learning) do projeto.

Aqui está o detalhamento de cada elemento:

1. O que é a pasta api/data?
É um diretório destinado a armazenar arquivos de dados de configuração e registro estruturados que servem de apoio à API (como definições de modelos, mapeamentos, etc.).

2. O que faz o arquivo model_registry.json?
Ele funciona como a Fonte Única de Verdade (Single Source of Truth - SSoT) para a gestão dos artefatos de IA do sistema. Em vez de definir caminhos de arquivos de forma rígida (hardcoded) no código, o sistema consulta esse registro para saber quais arquivos de modelo (.keras) e escalonadores (.pkl) carregar dinamicamente.

A estrutura do arquivo mapeia os dados por NCM (código de mercadoria, ex: 12019000 para Soja) e por UF (código do estado, ex: 14 para Roraima, 13 para Amazonas, etc.):

model_path: Nome do arquivo do modelo LSTM treinado (salvo em /data/models/).
scaler_path: Nome do arquivo do escalonador correspondente para normalização dos dados.
status: Define se o modelo está ativo (active) e pronto para uso em inferências.
max_tons_sanity: Limite físico máximo (em toneladas) utilizado na etapa de Sanity Check para evitar que simulações extremas gerem predições logísticas absurdas ou irreais.
NOTE

Existe também uma cópia/versão semelhante em server/data/model_registry.json. O backend em FastAPI (PredictorService e TrainEngine) utiliza essas configurações para carregar os modelos sob demanda (lazy loading) e realizar as predições de escoamento de safras para os próximos 12 meses.