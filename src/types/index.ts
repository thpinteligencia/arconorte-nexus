export interface ChartDataItem {
  name: string;
  soja: number;
  total: number;
  ipe: number;
}

export interface PredictionData {
  overallIPE: number;
  chartData: ChartDataItem[];
  picoTotal: number;
}
