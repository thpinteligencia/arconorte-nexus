### 1. Nomenclatura e Mapeamento dos Arquivos
Os arquivos seguem o padrão `[tipo]_[NCM]_[UF].[extensão]`:
* **`12019000`**: É o código **NCM** (Nomenclatura Comum do Mercosul) correspondente à **Soja** (grão).
* **Códigos de UF (Unidades da Federação do IBGE):**
  * **`14` (Roraima - RR):** Representado por `soy_rr_model.keras` e `soy_rr_scaler.pkl`. É o foco principal do seu artigo de especialização.
  * **`13` (Amazonas - AM):** Representado por `model_12019000_13.keras` e `scaler_12019000_13.pkl`.
  * **`15` (Pará - PA):** Representado por `model_12019000_15.keras` e `scaler_12019000_15.pkl`.
  * **`51` (Mato Grosso - MT):** Representado por `model_12019000_51.keras` e `scaler_12019000_51.pkl`.

---

### 2. O que são os arquivos com extensão `.keras`?
São arquivos binários que contêm a estrutura de rede neural e os pesos sinápticos aprendidos durante o treinamento. A arquitetura implementada neles (de acordo com o script de exportação) é de redes recorrentes **LSTM (Long Short-Term Memory)**, projetada especificamente para dados sequenciais e séries temporais:
* **Entrada (Input):** Recebe uma janela deslizante dos últimos **3 meses** (`LOOKBACK = 3`) com **3 variáveis** (`N_FEATURES = 3`):
  1. `Peso_Liquido` (Quantidade de soja escoada/exportada em kg).
  2. `Valor_FOB` (Valor das exportações em USD).
  3. `Safra_Ativa` (Variável binária indicando se o mês está no período de safra).
* **Arquitetura Interna:**
  * Camada LSTM com **8 neurônios/unidades**, função de ativação `ReLU` e regularização L2 (`l2(0.01)`) para evitar overfitting.
  * Camada de **Dropout de 30%** (`Dropout(0.3)`) para aumentar a robustez da rede.
  * Camada densa final de saída com 1 neurônio (que cospe o valor previsto do peso escoado para o mês seguinte).

---

### 3. O que são os arquivos com extensão `.pkl`?
São os **escaladores de dados** gerados pelo Scikit-Learn (`MinMaxScaler`) serializados via biblioteca `joblib`.
* **Para que servem:** Redes neurais do tipo LSTM são altamente sensíveis à escala dos dados. O escalador normaliza os valores reais históricos (que estão na casa dos milhões de quilos ou dólares) para uma escala de `[0, 1]` antes de alimentar o modelo Keras.
* **No momento da previsão:** O escalador realiza a transformação reversa (`inverse_transform`) do valor previsto de `[0, 1]` para toneladas reais para que o front-end consiga exibir gráficos compreensíveis.

---

### 4. Como são utilizados no Sistema
O arquivo `PredictorService` no backend carrega dinamicamente o modelo e o escalador com base no `model_registry.json`. Ele realiza uma **previsão de rollout recursivo de 12 meses** (onde o modelo prevê o mês seguinte, esse valor previsto é inserido na janela como dado "real" e o modelo prevê o próximo mês de forma recorrente).

Além disso, o registro impõe limites de sanidade (`max_tons_sanity`) específicos para cada UF, evitando distorções ou explosões numéricas na previsão da série temporal.

***

**Resumo das ações realizadas:**
* Liste os arquivos do diretório `data/models`.
* Localizei o arquivo de mapeamento `model_registry.json`.
* Analisei o código de treinamento (`export_soy_model.py`) e de inferência (`predictor_service.py`) para descrever com precisão os parâmetros de rede (LSTM, Lookback de 3 meses, 3 variáveis) e a relação dos IDs do IBGE com as UFs.