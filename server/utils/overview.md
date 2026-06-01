A pasta **`server/utils`** é o diretório reservado para **funções utilitárias e constantes auxiliares compartilhadas** por diferentes partes da aplicação backend (como os serviços de predição e os motores de treinamento).

Ela contém o seguinte arquivo:

### 1. **`crop_calendars.py`**
* **Responsabilidade**: Centralização e controle do calendário agrícola de safras por Unidade Federativa (UF) e código fiscal de produto (NCM).
* **O que faz**:
  * **Dicionário `CROP_CALENDARS`**: Mapeia para a cultura de Soja (`NCM 12019000`) quais meses do ano representam o escoamento ativo de safra para cada uma das quatro UFs atendidas pelo projeto:
    * **Roraima (`14`)**: Agosto a Dezembro.
    * **Mato Grosso (`51`)**: Fevereiro a Junho.
    * **Pará (`15`)**: Junho a Novembro.
    * **Amazonas (`13`)**: Julho a Dezembro.
  * **Função `is_safra_ativa(ncm, uf_id, date)`**: Recebe a data da simulação ou do registro histórico e retorna `1` se o mês daquela data estiver na janela de safra ativa mapeada para a respectiva cultura e estado, ou `0` caso contrário. 

### Resumo da Pasta
Em suma, `server/utils` isola lógica estática e regras paramétricas da agricultura regional (calendários de colheita/escoamento) para que tanto a IA na hora de treinar (`TrainEngine`) quanto as APIs na hora de prever (`PredictorService`) consultem uma única fonte da verdade (*Single Source of Truth*).