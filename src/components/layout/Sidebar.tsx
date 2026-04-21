import React from 'react';
import { LayoutDashboard, Zap, Database, FileText } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="nexus-sidebar">
      <div className="nexus-logo">
        <div className="logo-icon">AN</div>
        <div className="logo-text">
          <h1>ARCONORTE <span>NEXUS</span></h1>
          <p>Inteligência Logística</p>
        </div>
      </div>
      
      <nav className="nexus-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} /> Painel de Controle
        </button>
        
        <button 
          className={activeTab === 'simulacao' ? 'active' : ''} 
          onClick={() => setActiveTab('simulacao')}
        >
          <Zap size={18} /> Simulação Nexus
        </button>
        <button><Database size={18} /> Auditoria ComexStat</button>
        <button><FileText size={18} /> Relatórios Estratégicos</button>
      </nav>

      <div className="sidebar-footer">
        <p>Porto Seco Arco Norte</p>
        <span>Nexus v1.3 • 2026</span>
      </div>
    </aside>
  );
};

export default Sidebar;
