import React from 'react';
import { Activity, FileDown } from 'lucide-react';

interface SimulatorPanelProps {
  volSoja: number;
  setVolSoja: (val: number) => void;
  capacidadePorto: number;
  setCapacidadePorto: (val: number) => void;
  onDownloadReport: () => void;
  isDownloading: boolean;
}

const SimulatorPanel: React.FC<SimulatorPanelProps> = ({
  volSoja,
  setVolSoja,
  capacidadePorto,
  setCapacidadePorto,
  onDownloadReport,
  isDownloading
}) => {
  const handleReset = () => {
    setVolSoja(1);
    setCapacidadePorto(70000);
  };

  return (
    <div className="sidebar-simulator">
      <div className="sim-header">
        <Activity size={16} /> <span>Parâmetros Operacionais</span>
      </div>
      <div className="sim-control">
        <div className="label-row">
          <span>Soja (Multiplicador)</span> <span>{Math.round(volSoja * 100)}%</span>
        </div>
        <input 
          type="range" 
          min="0.5" 
          max="3.0" 
          step="0.1" 
          value={volSoja} 
          onChange={(e) => setVolSoja(parseFloat(e.target.value))} 
        />
      </div>
      <div className="sim-control">
        <div className="label-row">
          <span>Capacidade Terminal</span> <span>{Math.round(capacidadePorto / 1000)}k t</span>
        </div>
        <input 
          type="range" 
          min="20000" 
          max="500000" 
          step="10000" 
          value={capacidadePorto} 
          onChange={(e) => setCapacidadePorto(parseInt(e.target.value))} 
        />
      </div>
      <div className="sim-footer" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button className="btn-reset" onClick={handleReset}>
          Resetar
        </button>
        <button 
          className="btn-download" 
          onClick={onDownloadReport}
          disabled={isDownloading}
          style={{
            background: 'var(--verde-soja)',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: isDownloading ? 0.5 : 1
          }}
        >
          <FileDown size={14} />
          {isDownloading ? 'Gerando...' : 'Gerar Boletim'}
        </button>
      </div>
    </div>
  );
};

export default SimulatorPanel;
