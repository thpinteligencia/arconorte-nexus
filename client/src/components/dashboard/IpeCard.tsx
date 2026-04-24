import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { IconGauge } from '../common/NexusIcons';

interface IpeCardProps {
  ipe: number;
  pico: number;
  uf: string;
}

const IpeCard: React.FC<IpeCardProps> = ({ ipe, pico, uf }) => {
  const getStatus = (val: number) => {
    if (val < 50) return { label: 'Operação Normal', color: '#34A853', bg: 'rgba(52, 168, 83, 0.1)' };
    if (val < 80) return { label: 'Alerta de Fluxo', color: '#F4A261', bg: 'rgba(244, 162, 97, 0.1)' };
    return { label: 'Capacidade Crítica', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const status = getStatus(ipe);

  return (
    <div id="tutorial-ipe-card" className="glass-card" style={{ 
      padding: '1.5rem', 
      display: 'flex', 
      gap: '2rem', 
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Estética v1: Gauge Visual */}
      <div style={{ position: 'relative', width: '120px', height: '80px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          border: '10px solid rgba(255,255,255,0.05)',
          borderBottomColor: 'transparent',
          position: 'absolute',
          top: 0
        }} />
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          border: '10px solid transparent',
          borderTopColor: status.color,
          borderLeftColor: status.color,
          position: 'absolute',
          top: 0,
          transform: `rotate(${(ipe * 1.8) - 45}deg)`,
          transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: `drop-shadow(0 0 8px ${status.color}44)`
        }} />
        <div style={{ 
          position: 'absolute', 
          bottom: '-10px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: status.color }}>{ipe}%</span>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Pressão IPE</span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Monitoramento {uf}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Status do Terminal
              </h3>
              {ipe > 80 && <AlertTriangle size={16} color={status.color} className="animate-pulse" />}
            </div>
          </div>
          <span style={{ 
            fontSize: '0.65rem', 
            padding: '0.3rem 0.75rem', 
            borderRadius: '20px', 
            background: status.bg, 
            color: status.color,
            fontWeight: 800,
            border: `1px solid ${status.color}33`,
            textTransform: 'uppercase'
          }}>
            {status.label}
          </span>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem', 
          marginTop: '1.2rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-thin)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>PICO ESTIMADO</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
              <div className="nexus-icon-wrapper">
                <TrendingUp size={14} className="nexus-icon nexus-icon-bicolor nexus-icon-active" />
              </div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{(pico/1000).toFixed(1)}k <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)' }}>tons</span></strong>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>CONFIANÇA IA</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
              <div className="nexus-icon-wrapper">
                <IconGauge size={14} className="nexus-icon nexus-icon-bicolor nexus-icon-secondary" />
              </div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>98.4<span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)' }}>%</span></strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IpeCard;
