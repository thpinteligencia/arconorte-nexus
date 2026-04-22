import React from 'react';
import { Map, ChevronDown, Loader2, TrendingUp } from 'lucide-react';

interface HeaderProps {
  selectedUf: string;
  setSelectedUf: (uf: string) => void;
  availableUfs: string[];
  currentIPE: number;
  isLoading: boolean;
  ufsNames: Record<string, string>;
  getIPEColor: (ipe: number) => string;
}

const Header: React.FC<HeaderProps> = ({
  selectedUf,
  setSelectedUf,
  availableUfs,
  currentIPE,
  isLoading,
  ufsNames,
  getIPEColor,
}) => {
  return (
    <header className="nexus-header">
      <div className="header-titles">
        <h2>Dashboard Operacional: {ufsNames[selectedUf]}</h2>
        <p>IA Multivariada • Monitoramento de Escoamento Real</p>
        
        {/* Seletor de UF Dinâmico no Header */}
        <div className="uf-selector-box" style={{ marginTop: '1rem', width: 'fit-content' }}>
          <label style={{ marginBottom: '0.5rem' }}>
            <Map size={14} /> Corredor Logístico
          </label>
          <div className="select-wrapper">
            <select 
              value={selectedUf} 
              onChange={(e) => setSelectedUf(e.target.value)}
              style={{ paddingRight: '2.5rem' }}
            >
              {availableUfs.map(uf => (
                <option key={uf} value={uf}>{ufsNames[uf] || `UF ${uf}`}</option>
              ))}
            </select>
            <ChevronDown size={14} className="icon" />
          </div>
        </div>
      </div>
      
      <div className="header-widgets">
        <div 
          className="ipe-badge" 
          style={{ borderColor: getIPEColor(currentIPE), color: getIPEColor(currentIPE) }}
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
