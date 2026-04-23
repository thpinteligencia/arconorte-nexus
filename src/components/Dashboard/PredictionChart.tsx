import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Calendar, AlertCircle } from 'lucide-react';
import { ChartDataItem } from '../../types';

interface PredictionChartProps {
  chartData: ChartDataItem[];
}

const PredictionChart: React.FC<PredictionChartProps> = ({ chartData }) => {
  return (
    <div className="card nexus-card chart-card">
      <div className="card-header">
        <div className="title-with-warning">
          <h3><Calendar size={18} /> Horizonte Preditivo (12 Meses)</h3>
          <div className="degradation-warning">
            <AlertCircle size={14} /> 
            <span>Acurácia decresce progressivamente (Rollout Recursivo)</span>
          </div>
        </div>
        <div className="chart-legend">
           <span className="dot soja"></span> Soja
        </div>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSoja" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34A853" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34A853" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
            <XAxis dataKey="name" stroke="#636366" axisLine={false} tickLine={false} />
            <YAxis stroke="#636366" axisLine={false} tickLine={false} unit="t" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1C1C1E', 
                border: '1px solid #2C2C2E', 
                borderRadius: '8px' 
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="soja" 
              stackId="1" 
              stroke="#34A853" 
              strokeWidth={3} 
              fill="url(#colorSoja)" 
              name="Soja" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionChart;
