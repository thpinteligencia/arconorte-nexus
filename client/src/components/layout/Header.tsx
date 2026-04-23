import React from 'react';
import { Map, ChevronDown, Loader2, TrendingUp } from 'lucide-react';
import { getIPEColor as defaultGetIPEColor } from '../../utils';

interface HeaderProps {
  selectedUf?: string;
  setSelectedUf?: (uf: string) => void;
  availableUfs?: string[];
  currentIPE?: number;
  isLoading?: boolean;
  ufsNames?: Record<string, string>;
  getIPEColor?: (ipe: number) => string;
}

const Header: React.FC<HeaderProps> = ({
  selectedUf = "14",
  setSelectedUf = () => {},
  availableUfs = ["14"],
  currentIPE = 0,
  isLoading = false,
  ufsNames = { "14": "Roraima" },
  getIPEColor = defaultGetIPEColor,
}) => {
  return (
    <header className="nexus-header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: '2rem',
      padding: '0 0 1.5rem 0',
      borderBottom: '1px solid var(--border-thin)'
    }}>
      <div className="header-titles">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
          Dashboard Operacional: {ufsNames[selectedUf] || `UF ${selectedUf}`}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          IA Multivariada • Monitoramento de Escoamento Real
        </p>
        
        {/* Seletor de UF Dinâmico no Header */}
        <div id="tutorial-header" className="uf-selector-box" style={{ marginTop: '1rem', width: 'fit-content' }}>
          <label style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-dim)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem',
            marginBottom: '0.4rem'
          }}>
            <Map size={14} /> Corredor Logístico
          </label>
          <div className="select-wrapper" style={{ position: 'relative' }}>
            <select 
              value={selectedUf} 
              onChange={(e) => setSelectedUf(e.target.value)}
              style={{ 
                padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-thin)',
                borderRadius: '8px',
                color: 'white',
                appearance: 'none',
                cursor: 'pointer',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            >
              {availableUfs.map(uf => (
                <option key={uf} value={uf} style={{ background: '#1c1c1e' }}>
                  {ufsNames[uf] || `UF ${uf}`}
                </option>
              ))}
            </select>
            <ChevronDown size={14} style={{ 
              position: 'absolute', 
              right: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
              pointerEvents: 'none'
            }} />
          </div>
        </div>
      </div>
      
      <div className="header-widgets">
        <div 
          className="ipe-badge" 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.2rem',
            borderRadius: '12px',
            border: `1px solid ${getIPEColor(currentIPE)}44`, 
            color: getIPEColor(currentIPE),
            background: `${getIPEColor(currentIPE)}15`,
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: `0 0 15px ${getIPEColor(currentIPE)}22`
          }}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <TrendingUp size={16} />
          )} 
          IPE: {currentIPE}%
        </div>
      </div>
    </header>
  );
};

export default Header;
