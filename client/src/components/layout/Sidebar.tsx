import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight,
  Globe
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel de Controle', icon: LayoutDashboard },
    { id: 'simulacao', label: 'Simulação Nexus', icon: Zap },
    { id: 'audit', label: 'Auditoria ComexStat', icon: ShieldCheck },
    { id: 'reports', label: 'Relatórios Estratégicos', icon: FileText },
  ];

  return (
    <aside style={{ 
      width: '300px', 
      background: 'rgba(22, 22, 24, 0.9)', 
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border-thin)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Branding v1 Style */}
      <div style={{ marginBottom: '3.5rem', paddingLeft: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'var(--grad-nexus)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--grad-glow)'
          }}>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'white' }}>AN</span>
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.2rem', 
              fontWeight: 800, 
              letterSpacing: '0.05em', 
              lineHeight: 1,
              margin: 0,
              color: 'white'
            }}>
              ARCONORTE <span style={{ color: 'var(--primary)' }}>NEXUS</span>
            </h1>
            <p style={{ 
              fontSize: '0.65rem', 
              color: 'var(--text-dim)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.15em',
              marginTop: '4px',
              fontWeight: 700
            }}>
              Inteligência Logística
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={item.id === 'audit' ? 'tutorial-audit-tab' : undefined}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: isActive ? 'rgba(46, 204, 113, 0.2)' : 'transparent',
                background: isActive ? 'rgba(46, 204, 113, 0.08)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <div className={`nexus-icon-wrapper ${isActive ? 'nexus-icon-active' : ''}`}>
                <Icon size={18} strokeWidth={isActive ? 2 : 1.75} className="nexus-icon nexus-icon-bicolor" />
              </div>
              <span style={{ flex: 1, fontSize: '0.9rem' }}>{item.label}</span>
              {isActive && (
                <div style={{ 
                  width: '4px', 
                  height: '16px', 
                  background: 'var(--primary)', 
                  borderRadius: '2px',
                  position: 'absolute',
                  left: '0'
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer v1 Style */}
      <div style={{ 
        borderTop: '1px solid var(--border-thin)', 
        paddingTop: '1.5rem', 
        marginTop: '1.5rem',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem' 
      }}>
        <div style={{ paddingLeft: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)' }}>
            <Globe size={14} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Porto Seco Arco Norte</span>
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '4px', opacity: 0.6 }}>
            Nexus AI Engine v1.3 • 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.6rem 1rem', 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-dim)', 
            fontSize: '0.85rem', 
            cursor: 'pointer',
            borderRadius: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            <Settings size={16} /> Configurações
          </button>
          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.6rem 1rem', 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--danger)', 
            fontSize: '0.85rem', 
            cursor: 'pointer', 
            opacity: 0.8,
            borderRadius: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
