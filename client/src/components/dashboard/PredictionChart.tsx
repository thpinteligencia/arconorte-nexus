import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Line
} from 'recharts';

interface PredictionChartProps {
  data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{label}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Volume Soja:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{payload[0].value.toLocaleString()} t</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Pressão IPE:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{payload[1].value}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const PredictionChart: React.FC<PredictionChartProps> = ({ data }) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Projeção de Escoamento (12 Meses)</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Volume (Tons)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pressão (%)</span>
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSoja" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-dim)', fontSize: 11 }} 
              dy={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-dim)', fontSize: 11 }} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-dim)', fontSize: 11 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="soja"
              stroke="var(--primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSoja)"
              animationDuration={1500}
            />
            
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ipe"
              stroke="var(--secondary)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'var(--secondary)', r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={2000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionChart;
