export const MOCK_REGISTRY = {
  "12019000": {
    "14": { "status": "active" },
    "13": { "status": "active" },
    "15": { "status": "active" },
    "51": { "status": "active" }
  }
};

export const MOCK_PREDICTIONS = {
  overallIPE: 68.5,
  picoTotal: 84200,
  chartData: [
    { name: 'Jan', soja: 45000, ipe: 32 },
    { name: 'Fev', soja: 52000, ipe: 38 },
    { name: 'Mar', soja: 78000, ipe: 55 },
    { name: 'Abr', soja: 92000, ipe: 65 },
    { name: 'Mai', soja: 105000, ipe: 75 },
    { name: 'Jun', soja: 120000, ipe: 85 },
    { name: 'Jul', soja: 115000, ipe: 82 },
    { name: 'Ago', soja: 95000, ipe: 68 },
    { name: 'Set', soja: 82000, ipe: 58 },
    { name: 'Out', soja: 65000, ipe: 45 },
    { name: 'Nov', soja: 55000, ipe: 39 },
    { name: 'Dez', soja: 48000, ipe: 34 }
  ]
};

export const MOCK_AUDIT = {
  evaluations: [
    { id: 1, uf: "14", ncm: "12019000", rmse: 0.0421, mae: 0.0315 },
    { id: 2, uf: "13", ncm: "12019000", rmse: 0.0512, mae: 0.0382 }
  ],
  total_inferences: 1254,
  recent_logs: [
    { id: 101, timestamp: new Date().toISOString(), uf: "14", ncm: "12019000", vol_mult: 1.2 },
    { id: 102, timestamp: new Date().toISOString(), uf: "13", ncm: "12019000", vol_mult: 1.0 }
  ]
};
