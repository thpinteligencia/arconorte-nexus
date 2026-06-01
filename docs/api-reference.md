# Referência da API: ArcoNorte Nexus (v21.04.2026)

## 🚀 Endpoints Principais

### 📋 Registro de Modelos Ativos
**GET `/api/v1/registry`**
Retorna o conteúdo do `model_registry.json`. Utilizado pelo Frontend para saber quais filtros de UF e NCM habilitar na interface.

#### Resposta (200 OK)
```json
{
  "12019000": {
    "14": {
      "status": "active",
      "model_path": "model_12019000_14.keras",
      "scaler_path": "scaler_12019000_14.pkl",
      "max_tons_sanity": 380
    }
  }
}
```

---

### 🔮 Motor Preditivo de Soja (Integração Principal)
**POST `/api/v1/predict/soja`**
Aciona o pipeline completo: busca dados reais, executa inferência via `PredictorService` e calcula métricas via `IPEEngine`.

#### Parâmetros da Requisição
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `uf` | string | ID da Unidade Federativa (ex: "14" para RR). |
| `capacity` | number | Capacidade estática do porto em toneladas. |
| `volSoja` | number | Multiplicador de volume para simulação de safra. |

#### Exemplo de Payload
```json
{
  "uf": "14",
  "capacity": 70000,
  "volSoja": 1.2
}
```

#### Resposta (200 OK)
```json
{
  "chartData": [
    { "name": "Jan", "soja": 1250.5, "total": 1250.5, "ipe": 1.79 },
    { "name": "Fev", "soja": 45000.0, "total": 45000.0, "ipe": 64.29 }
  ],
  "overallIPE": 64.29,
  "picoTotal": 45000.0
}
```

---

## 🛠️ Serviços Internos (Arquitetura)

### PredictorService
- **Rollout Recursivo:** Previsão de 12 meses onde o output de $t+1$ serve como input para $t+2$.
- **Memória:** Mantém os modelos carregados em um dicionário de cache para evitar IO excessivo.

### IPEEngine
- **Cálculo de Pressão:** Define a fórmula `(Volume Total / Capacidade) * 100`.
- **Nível de Stress:** Atribui categorias (Normal, Alerta, Crítico) baseadas no IPE calculado.

---

## 🚦 Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 503 | Motor de IA indisponível ou dados do ComexStat fora do ar. |
| 404 | Modelo não encontrado para a UF/NCM solicitada no registro. |
| 500 | Erro interno no processamento de tensores ou pós-processamento. |
