# Referência da API: ArcoNorte Nexus

## 🚀 Endpoints da API (v1)

### 🩺 Status da API
**GET `/api/v1/status`**
Retorna o estado operacional do sistema e verifica se o motor de IA foi carregado corretamente.

#### Resposta (200 OK)
```json
{
  "status": "operational",
  "model_loaded": true
}
```

---

### 📋 Registro de Modelos
**GET `/api/v1/registry`**
Lista todos os modelos e scalers disponíveis no sistema, incluindo metadados como UF, NCM e métricas de acurácia.

#### Resposta (200 OK)
```json
{
  "models": [
    {
      "ncm": "12019000",
      "uf": "14",
      "version": "1.0",
      "path": "model_12019000_14.keras"
    }
  ]
}
```

---

### 🧪 Simulador de Cenários
**POST `/api/v1/simulate`**
Envia parâmetros de simulação (capacidade do porto, volumes de safra) e recebe as predições de escoamento e IPE (Índice de Pressão de Escoamento).

#### Requisição
```json
{
  "capacity": 70000,
  "uf": "14",
  "volSoja": 1.2,
  "volMilho": 1.0,
  "volArroz": 0.8
}
```

#### Resposta (200 OK)
```json
{
  "ipe_timeline": [
    { "month": "Jan", "ipe": 45.2, "stress_level": "Normal" },
    { "month": "Fev", "ipe": 88.5, "stress_level": "Crítico" }
  ],
  "predictions": {
    "soja": [12000, 15000, 18000],
    "milho": [2000, 3000, 4000],
    "arroz": [5000, 6000, 7000]
  }
}
```

---

## 🛠️ Erros Comuns

| Código | Descrição |
|--------|-----------|
| 400 | Payload de simulação inválido ou mal formatado. |
| 404 | Modelo não encontrado para a combinação UF/NCM solicitada. |
| 500 | Erro interno no motor de inferência (TensorFlow). |

## 🧪 Exemplo de cURL
```bash
curl -X POST http://localhost:8000/api/v1/simulate \
     -H "Content-Type: application/json" \
     -d '{"capacity": 70000, "uf": "14"}'
```
