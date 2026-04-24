import React from 'react';
import { Download, RefreshCw, Ship, MapPin, Database } from 'lucide-react';
import { UFS_NAMES } from '../../constants';

interface SimulatorPanelProps {
  selectedUf: string;
  setSelectedUf: (uf: string) => void;
  availableUfs: string[];
  volSoja: number;
  setVolSoja: (vol: number) => void;
  capacidadePorto: number;
  setCapacidadePorto: (cap: number) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

const SimulatorPanel: React.FC<SimulatorPanelProps> = ({
  selectedUf,
  setSelectedUf,
  availableUfs,
  volSoja,
  setVolSoja,
  capacidadePorto,
  setCapacidadePorto,
  onDownload,
  isDownloading
}) => {
  return (
    <aside className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div className={`nexus-icon-framed ${isDownloading ? 'active nexus-icon-processing' : ''}`}>
          <RefreshCw size={20} className="nexus-icon nexus-icon-bicolor nexus-icon-active" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Simulador Nexus</h3>
      </div>

      {/* UF Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="nexus-icon-wrapper">
            <MapPin size={14} className="nexus-icon nexus-icon-bicolor" />
          </div>
          Origem da Produção (UF)
        </label>
        <select 
          value={selectedUf} 
          onChange={(e) => setSelectedUf(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-thin)',
            borderRadius: '8px',
            color: 'white',
            padding: '0.75rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {availableUfs.map(uf => (
            <option key={uf} value={uf} style={{ background: '#1c1c1e' }}>
              {UFS_NAMES[uf as keyof typeof UFS_NAMES] || uf}
            </option>
          ))}
        </select>
      </div>

      {/* Volume Soja Slider */}
      <div id="tutorial-vol-slider" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div className="nexus-icon-wrapper">
              <Database size={14} className="nexus-icon nexus-icon-bicolor nexus-icon-active" />
            </div>
            Safra (Multiplicador)
          </label>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{volSoja}x</span>
        </div>
        <input 
          type="range" 
          min="0.5" 
          max="2.0" 
          step="0.1" 
          value={volSoja} 
          onChange={(e) => setVolSoja(parseFloat(e.target.value))}
          style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
        />
      </div>

      {/* Capacidade Slider */}
      <div id="tutorial-cap-slider" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div className="nexus-icon-wrapper">
              <Ship size={14} className="nexus-icon nexus-icon-bicolor nexus-icon-secondary" />
            </div>
            Capacidade Porto (Tons)
          </label>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)' }}>
            {(capacidadePorto/1000).toFixed(0)}k
          </span>
        </div>
        <input 
          type="range" 
          min="10000" 
          max="200000" 
          step="5000" 
          value={capacidadePorto} 
          onChange={(e) => setCapacidadePorto(parseInt(e.target.value))}
          style={{ accentColor: 'var(--secondary)', cursor: 'pointer' }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Botão de Download */}
      <button 
        id="tutorial-report-btn"
        onClick={onDownload}
        disabled={isDownloading}
        style={{
          background: 'var(--grad-nexus)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '1rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          cursor: isDownloading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: isDownloading ? 0.7 : 1,
          boxShadow: 'var(--grad-glow)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {isDownloading ? (
          <RefreshCw className="animate-spin" size={20} />
        ) : (
          <Download size={20} />
        )}
        {isDownloading ? 'Gerando...' : 'Exportar Boletim PDF'}
      </button>
    </aside>
  );
};

export default SimulatorPanel;
