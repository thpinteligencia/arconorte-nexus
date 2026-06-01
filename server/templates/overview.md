A pasta **`server/templates`** é o diretório que armazena os templates visualizáveis em HTML que a aplicação utiliza para gerar arquivos de saída formatados. Atualmente, ela possui um único arquivo:

### 1. **`boletim.html`**
* **Responsabilidade**: É um template **Jinja2** estruturado em HTML e estilizado com CSS embutido.
* **O que faz**:
  * Serve como o esqueleto visual (layout de página) para o **Boletim Estratégico de Inteligência Logística** gerado pelo `ReportingService` (em `server/services/reporting_service.py`).
  * **Tags Dinâmicas (Jinja2)**: Contém espaços reservados demarcados por chaves (como `{{ uf_name }}`, `{{ ncm }}`, `{{ ipe }}` e `{{ date }}`) que o servidor preenche dinamicamente em tempo de execução com os dados reais calculados de escoamento.
  * **Estilização e Lógica Visual**:
    * Utiliza CSS clássico formatado especificamente para renderizadores de impressão PDF (como o WeasyPrint).
    * Implementa uma lógica de formatação de cores baseada em alertas (badges) para o IPE (Índice de Pressão de Escoamento) projetado:
      * **Verde (`ipe-green`)**: Pressão menor que 50% (Fluxo seguro).
      * **Laranja (`ipe-yellow`)**: Pressão entre 50% e 79% (Alerta de congestionamento).
      * **Vermelho (`ipe-red`)**: Pressão de 80% ou mais (Saturação logística/pico crítico).
    * Renderiza dinamicamente uma tabela contendo as projeções de volume (soja), receita (valor FOB) e IPE de cada um dos próximos 12 meses usando um loop `{% for row in data %}`.

### Resumo da Pasta
Em suma, esta pasta é responsável por guardar as **estruturas visuais de relatórios e documentos** da aplicação, separando o design e a formatação visual (HTML/CSS) do código que processa as regras de negócio em Python.