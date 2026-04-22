import React from 'react';
import { BarChart3, Info } from 'lucide-react';

interface IpeCardProps {
  currentIPE: number;
  soyProp: number;
  getIPEColor: (ipe: number) => string;
}

const IpeCard: React.FC<IpeCardProps> = ({ currentIPE, soyProp, getIPEColor }) => {
  return (
    <div className="card nexus-card ipe-card">
      <div className="card-header">
        <h3><BarChart3 size={18} /> Índice de Pressão</h3>
        <Info size={16} className="info-icon" />
      </div>
      <div className="gauge-viz">
        <div className="nexus-gauge">
          <div className="gauge-bg"></div>
          <div 
            className="gauge-fill" 
            style={{ 
              transform: `rotate(${(currentIPE * 1.8) - 90}deg)`,
              background: getIPEColor(currentIPE)
            }}
          ></div>
          <div className="gauge-center">
            <span className="ipe-value">{currentIPE}<span>%</span></span>
            <span className="ipe-label">
              {currentIPE > 90 ? 'SATURADO' : 'OPERACIONAL'}
            </span>
          </div>
        </div>
      </div>
      <div className="ipe-breakdown">
        <div className="item">
          <div className="info">
            <span>Soja (IA Real)</span> <span>{soyProp}%</span>
          </div>
          <div className="track">
            <div 
              className="bar" 
              style={{ width: `${soyProp}%`, background: '#34A853' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IpeCard;
