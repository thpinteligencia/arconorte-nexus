## ✅ Resolução (Junho 2026)

A divergência histórica sobre o diretório de artefatos foi resolvida.

- **Diretório oficial de modelos e escaladores:** `data/models/` na raiz do projeto, configurável via `MODEL_ARTIFACTS_DIR`.
- **Registro oficial de modelos:** `server/data/model_registry.json` (Single Source of Truth).
- **Valores de `max_tons_sanity`** unificados a partir do registry do `api/` (RR=80k, AM=150k, PA=500k, MT=1.2M).
- A pasta `server/artifacts/` permanece **apenas como documentação histórica** e **não deve receber novos binários `.keras` ou `.pkl`**.

---

A pasta **`server/artifacts`** está atualmente **vazia** (exceto este documento de legado).

No entanto, conforme estabelecido na documentação de padrões do projeto (`docs/code-standards.md`), ela é designada para guardar os **artefatos de Machine Learning** (modelos de previsão treinados `.keras` e os normalizadores/escaladores `.pkl`).

### Detalhes importantes de funcionamento:

1. **Destinação nos Padrões de Código:**
   De acordo com o arquivo `docs/code-standards.md`, a diretriz para a persistência dos modelos é:
   * Salvar os modelos `.keras` e `.pkl` em `server/artifacts/`.
   * Registrá-los no arquivo `server/data/model_registry.json`.

2. **Divergência com a Configuração Atual (Runtime):**
   No código do serviço de predição (`server/services/predictor_service.py`), o diretório configurado para carregar os modelos ativos em tempo de execução aponta para a pasta global **`data/models/`** na raiz do projeto (onde se encontram os arquivos reais como `model_12019000_13.keras` e `scaler_12019000_13.pkl`). 

### Resumo
Portanto, a pasta `server/artifacts` serve como o local documentado para o armazenamento dos artefatos de modelos preditivos do servidor, embora a implementação atual do `PredictorService` esteja consumindo esses arquivos a partir do diretório `/data/models` na raiz do repositório.

Viewed .gitignore:1-18
Ran command: `git status`

Seguindo as **melhores práticas de Engenharia de IA e MLOps**, a organização, o versionamento e o carregamento de artefatos de modelos devem seguir princípios de separação de conceitos, automação e escalabilidade.

Abaixo estão as recomendações de melhores práticas para resolver a divergência no seu projeto e elevar o nível da arquitetura:

---

### 1. Separação Estrita de Código (Code) e Dados/Artefatos (Data/Artifacts)
* **O Problema:** Arquivos binários de modelos (`.keras`, `.pkl`) são pesados e mudam frequentemente após novos treinamentos. Comitá-los diretamente no Git junto com o código do servidor (`server/artifacts/`) causa o chamado *Git Bloat* (repositório gigante e lento para clonar).
* **Melhor Prática:** **Código fica no Git; Modelos ficam no Storage.**
  * O diretório executável do servidor (`server/`) não deve conter arquivos binários.
  * A pasta de modelos deve residir fora da pasta da aplicação (por exemplo, na raiz `/data/models`), e **deve ser ignorada no `.gitignore`**.
  * Para projetos locais, use ferramentas como **DVC (Data Version Control)** que versionam metadados leves no Git e salvam os binários pesados no Google Drive, S3, Azure Blob, ou localmente fora do controle de versão padrão.

### 2. Configuração de Caminhos via Variáveis de Ambiente
* **O Problema:** Atualmente, o caminho está hardcoded em `predictor_service.py` (`os.path.join(ROOT_DIR, "data", "models")`) e em `export_soy_model.py` (`"api/artifacts"`).
* **Melhor Prática:** Configurar caminhos de forma dinâmica através do arquivo `.env`.
  * Defina uma variável, por exemplo: `MODEL_ARTIFACTS_DIR=/path/to/data/models`.
  * O código lê essa variável: `ARTIFACTS_DIR = os.getenv("MODEL_ARTIFACTS_DIR", "./data/models")`.
  * Isso permite que em desenvolvimento você aponte para uma pasta local rápida, e em produção (Docker/Kubernetes) aponte para um volume compartilhado ou montagem de rede.

### 3. Ciclo de Vida do Model Registry (Mapeamento Dinâmico)
O uso do `model_registry.json` é uma **ótima prática** para versionamento simples. Para mantê-lo limpo:
* O arquivo `model_registry.json` fica sob controle de versão (Git) pois é um arquivo de texto leve que mapeia a configuração do sistema (quais modelos estão ativos).
* Os arquivos referenciados nele (ex: `"model_path": "soy_rr_model.keras"`) são baixados/copiados de forma independente.
* **Abordagem de Produção:** Na inicialização do servidor, um script de *Bootstrap* lê o `model_registry.json`, verifica se os arquivos necessários existem na pasta local `MODEL_ARTIFACTS_DIR` e, caso não existam, baixa-os dinamicamente de um repositório de artefatos central (como MLflow Model Registry, ou um bucket S3/GCS).

### 4. Correção e Padronização do Código Atual
Considerando o estado do seu projeto hoje, a melhor abordagem imediata (com o menor custo e maior alinhamento de práticas) seria:

1. **Unificar o destino:** Adotar a pasta global `/data/models` (na raiz do projeto) como a pasta padrão de execução local.
2. **Atualizar a documentação (`docs/code-standards.md`):** Alterar a diretriz para refletir que os artefatos de execução local ficam em `/data/models/` e garantir que este diretório esteja no `.gitignore` global do projeto.
3. **Parametrizar a pipeline de treino:** Ajustar scripts como `research/export_soy_model.py` para salvar os novos modelos no mesmo diretório padrão em vez de criar pastas órfãs como `api/artifacts`.

---

### Resumo do Fluxo Recomendado:

```mermaid
graph TD
    subgraph Repositório Git (Apenas Código e Configurações)
        A[Código do Servidor]
        B[model_registry.json]
    end
    
    subgraph Storage de Modelos (Fora do Git)
        C[(/data/models/)]
        D[Modelos .keras]
        E[Scalers .pkl]
    end
    
    B -->|Mapeia metadados e arquivos ativos| D
    A -->|Carrega via PredictorService| C
    C -->|Lê arquivos físicos em runtime| A
```