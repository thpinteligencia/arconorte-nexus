import React, { useState } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Legend 
} from 'recharts';
import { 
  AlertTriangle, TrendingUp, Package, Calendar, FileText, 
  Settings, LayoutDashboard, Info, Truck, Warehouse, Map, 
  Activity, Zap, BarChart3, Database
} from 'lucide-react';

// --- Dados de Safra Roraima (Horizonte Preditivo) ---
const horizonData = [
  { name: 'Jan', soja: 5000, milho: 2000, arroz: 8000 },
  { name: 'Fev', soja: 4000, milho: 3000, arroz: 7000 },
  { name: 'Mar', soja: 3000, milho: 10000, arroz: 6000 },
  { name: 'Abr', soja: 2000, milho: 15000, arroz: 4000 }, // Pico Milho
  { name: 'Mai', soja: 1000, milho: 12000, arroz: 3000 },
  { name: 'Jun', soja: 800, milho: 8000, arroz: 2000 },
  { name: 'Jul', soja: 12000, milho: 4000, arroz: 1500 }, // Início Safra Soja
  { name: 'Ago', soja: 45000, milho: 2000, arroz: 1000 }, // Pico Soja
  { name: 'Set', soja: 55000, milho: 1500, arroz: 5000 }, // Conflito Soja/Arroz
  { name: 'Out', soja: 40000, milho: 1000, arroz: 15000 }, // Pico Arroz
  { name: 'Nov', soja: 20000, milho: 500, arroz: 10000 },
  { name: 'Dez', soja: 10000, milho: 800, arroz: 5000 },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- Estados do Simulador (Parâmetros Nexus) ---
  const [volSoja, setVolSoja] = useState(1.0); 
  const [volMilho, setVolMilho] = useState(1.0);
  const [volArroz, setVolArroz] = useState(1.0);
  const [capacidadePorto, setCapacidadePorto] = useState(70000);

  // --- Lógica Nexus Preditiva ---
  const simulatedData = horizonData.map(d => ({
    ...d,
    soja: Math.round(d.soja * volSoja),
    milho: Math.round(d.milho * volMilho),
    arroz: Math.round(d.arroz * volArroz),
    total: Math.round((d.soja * volSoja) + (d.milho * volMilho) + (d.arroz * volArroz))
  }));

  const picoSimulado = Math.max(...simulatedData.map(d => d.total));
  const currentIPE = Math.min(100, Math.round((picoSimulado / capacidadePorto) * 100));

  const getIPEColor = (val: number) => {
    if (val < 70) return '#34A853'; // Verde Soja
    if (val < 90) return '#F4A261'; // Dourado Colheita
    return '#EF4444'; // Crítico
  };

  return (
    <div className="nexus-container">
      {/* Sidebar - Identidade Grafite Profundo */}
      <aside className="nexus-sidebar">
        <div className="nexus-logo">
          <div className="logo-icon">AN</div>
          <div className="logo-text">
            <h1>ARCONORTE <span>NEXUS</span></h1>
            <p>Inteligência Logística</p>
          </div>
        </div>
        
        <nav className="nexus-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} /> Painel de Controle
          </button>
          <button className={activeTab === 'simulacao' ? 'active' : ''} onClick={() => setActiveTab('simulacao')}>
            <Zap size={18} /> Simulação Nexus
          </button>
          <button><Map size={18} /> Rotas e Fluxo</button>
          <button><Database size={18} /> Auditoria ComexStat</button>
          <button><FileText size={18} /> Relatórios Estratégicos</button>
        </nav>
        
        {/* Simulador Integrado na Sidebar */}
        <div className="sidebar-simulator">
          <div className="sim-header">
             <Activity size={16} /> <span>Parâmetros Operacionais</span>
          </div>
          <div className="sim-control">
            <div className="label-row"><span>Soja (NCM 12019000)</span> <span>{Math.round(volSoja * 100)}%</span></div>
            <input type="range" min="0.5" max="2.0" step="0.1" value={volSoja} onChange={(e) => setVolSoja(parseFloat(e.target.value))} />
          </div>
          <div className="sim-control">
            <div className="label-row"><span>Milho (NCM 10059010)</span> <span>{Math.round(volMilho * 100)}%</span></div>
            <input type="range" min="0.5" max="2.0" step="0.1" value={volMilho} onChange={(e) => setVolMilho(parseFloat(e.target.value))} />
          </div>
          <div className="sim-control">
            <div className="label-row"><span>Capacidade Terminal</span> <span>{Math.round(capacidadePorto/1000)}k t</span></div>
            <input type="range" min="50000" max="120000" step="5000" value={capacidadePorto} onChange={(e) => setCapacidadePorto(parseInt(e.target.value))} />
          </div>
          <button className="btn-reset" onClick={() => { setVolSoja(1); setVolMilho(1); setVolArroz(1); setCapacidadePorto(70000); }}>
            Resetar Cenário
          </button>
        </div>

        <div className="sidebar-footer">
          <p>Porto Seco Roraima</p>
          <span>Nexus v1.2 • 2024</span>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="nexus-main">
        <header className="nexus-header">
          <div className="header-titles">
            <h2>{activeTab === 'simulacao' ? 'Estudo de Caso Preditivo' : 'Dashboard Operacional'}</h2>
            <p>Dos dados ao movimento. Da previsão à decisão.</p>
          </div>
          <div className="header-widgets">
            <div className="ipe-badge" style={{ borderColor: getIPEColor(currentIPE), color: getIPEColor(currentIPE) }}>
              <TrendingUp size={16} /> IPE: {currentIPE}%
            </div>
            <div className="last-sync">
              <Activity size={14} /> Sincronizado: Hoje, 08:45
            </div>
          </div>
        </header>

        <div className="nexus-content">
          {/* Grid Superior: KPI e Gráfico */}
          <div className="nexus-grid-main">
            
            {/* Card do Índice de Pressão (IPE) - Estilo Nexus */}
            <div className="card nexus-card ipe-card">
              <div className="card-header">
                <h3><BarChart3 size={18} /> Índice de Pressão de Escoamento</h3>
                <Info size={16} className="info-icon" />
              </div>
              <div className="gauge-viz">
                <div className="nexus-gauge">
                  <div className="gauge-bg"></div>
                  <div className="gauge-fill" style={{ 
                    transform: `rotate(${(currentIPE * 1.8) - 90}deg)`,
                    background: getIPEColor(currentIPE)
                  }}></div>
                  <div className="gauge-center">
                    <span className="ipe-value">{currentIPE}<span>%</span></span>
                    <span className="ipe-label">{currentIPE > 90 ? 'SATURADO' : 'OPERACIONAL'}</span>
                  </div>
                </div>
              </div>
              <div className="ipe-breakdown">
                <div className="item">
                  <div className="info"><span>Soja</span> <span>{Math.round(volSoja * 82)}%</span></div>
                  <div className="track"><div className="bar" style={{ width: `${Math.min(100, volSoja * 82)}%`, background: '#34A853' }}></div></div>
                </div>
                <div className="item">
                  <div className="info"><span>Milho</span> <span>{Math.round(volMilho * 28)}%</span></div>
                  <div className="track"><div className="bar" style={{ width: `${Math.min(100, volMilho * 28)}%`, background: '#F4A261' }}></div></div>
                </div>
                <div className="item">
                  <div className="info"><span>Arroz</span> <span>{Math.round(volArroz * 45)}%</span></div>
                  <div className="track"><div className="bar" style={{ width: `${Math.min(100, volArroz * 45)}%`, background: '#007BFF' }}></div></div>
                </div>
              </div>
            </div>

            {/* Horizonte de Safra - Micro-LSTM Area Chart */}
            <div className="card nexus-card chart-card">
              <div className="card-header">
                <h3><Calendar size={18} /> Horizonte Preditivo Roraima (12 Meses)</h3>
                <div className="chart-legend">
                   <span className="dot soja"></span> Soja
                   <span className="dot milho"></span> Milho
                   <span className="dot arroz"></span> Arroz
                </div>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={simulatedData}>
                    <defs>
                      <linearGradient id="colorSoja" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34A853" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#34A853" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMilho" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F4A261" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F4A261" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorArroz" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007BFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
                    <XAxis dataKey="name" stroke="#636366" axisLine={false} tickLine={false} />
                    <YAxis stroke="#636366" axisLine={false} tickLine={false} unit="t" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid #2C2C2E', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="soja" stackId="1" stroke="#34A853" strokeWidth={3} fill="url(#colorSoja)" name="Soja" />
                    <Area type="monotone" dataKey="milho" stackId="1" stroke="#F4A261" strokeWidth={3} fill="url(#colorMilho)" name="Milho" />
                    <Area type="monotone" dataKey="arroz" stackId="1" stroke="#007BFF" strokeWidth={3} fill="url(#colorArroz)" name="Arroz" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Seção Inferior: Insights Operacionais */}
          <div className="nexus-insights">
            <div className="insight-card">
              <Truck size={24} className="icon" />
              <div className="txt">
                <h4>Fluxo de Carga</h4>
                <p>Projeção de <strong>{Math.round(picoSimulado/30)}</strong> caminhões/dia no pico.</p>
              </div>
            </div>
            <div className="insight-card">
              <Warehouse size={24} className="icon" />
              <div className="txt">
                <h4>Armazenagem</h4>
                <p>Utilização de pátio em <strong>{currentIPE}%</strong> da capacidade total.</p>
              </div>
            </div>
            <div className="insight-card action">
              <FileText size={24} className="icon" />
              <div className="txt">
                <h4>Ação Recomendada</h4>
                <p>{currentIPE > 85 ? 'Solicitar agilidade no desembaraço (MAPA).' : 'Manter cronograma de escoamento padrão.'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        :root {
          --bg-profundo: #1C1C1E;
          --bg-card: #2C2C2E;
          --verde-soja: #34A853;
          --dourado: #F4A261;
          --azul-nexus: #007BFF;
          --warm-white: #F7F7F7;
          --muted: #636366;
          --danger: #EF4444;
          --sidebar-w: 320px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: var(--bg-profundo); color: var(--warm-white); }

        .nexus-container { display: flex; height: 100vh; overflow: hidden; }

        /* Sidebar Premium */
        .nexus-sidebar { 
          width: var(--sidebar-w); background: #000; border-right: 1px solid #2C2C2E;
          display: flex; flex-direction: column; padding: 2.5rem 1.5rem;
        }

        .nexus-logo { display: flex; align-items: center; gap: 1rem; margin-bottom: 3.5rem; }
        .logo-icon { 
          background: var(--verde-soja); color: white; width: 44px; height: 44px; 
          border-radius: 10px; display: grid; place-items: center; font-weight: 800; font-size: 1.2rem;
        }
        .logo-text h1 { font-size: 1.1rem; font-weight: 800; letter-spacing: 1px; }
        .logo-text h1 span { color: var(--verde-soja); }
        .logo-text p { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }

        .nexus-nav { display: flex; flex-direction: column; gap: 0.6rem; }
        .nexus-nav button {
          display: flex; align-items: center; gap: 1rem; background: transparent; border: none;
          color: var(--muted); padding: 0.8rem 1rem; border-radius: 10px; cursor: pointer;
          transition: 0.3s; font-size: 0.9rem; font-weight: 600; text-align: left;
        }
        .nexus-nav button:hover, .nexus-nav button.active { background: #1C1C1E; color: var(--warm-white); }
        .nexus-nav button.active { border-left: 3px solid var(--verde-soja); color: var(--verde-soja); }

        /* Sidebar Simulator Controls */
        .sidebar-simulator { margin-top: 3rem; background: #1C1C1E; padding: 1.5rem; border-radius: 16px; display: flex; flex-direction: column; gap: 1.5rem; }
        .sim-header { display: flex; align-items: center; gap: 0.75rem; color: var(--verde-soja); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
        .sim-control { display: flex; flex-direction: column; gap: 0.5rem; }
        .sim-control .label-row { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--muted); }
        .sim-control input[type="range"] { 
          appearance: none; width: 100%; height: 4px; background: #2C2C2E; border-radius: 2px; outline: none;
        }
        .sim-control input[type="range"]::-webkit-slider-thumb {
          appearance: none; width: 14px; height: 14px; background: var(--verde-soja); border-radius: 50%; cursor: pointer;
        }
        .btn-reset { 
          background: transparent; border: 1px dashed var(--muted); color: var(--muted); 
          padding: 0.6rem; border-radius: 8px; font-size: 0.75rem; cursor: pointer; transition: 0.2s;
        }
        .btn-reset:hover { color: var(--warm-white); border-color: var(--warm-white); }

        .sidebar-footer { margin-top: auto; text-align: center; font-size: 0.7rem; color: var(--muted); padding-top: 2rem; }

        /* Main Content */
        .nexus-main { flex: 1; padding: 3rem; overflow-y: auto; }

        .nexus-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; }
        .header-titles h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.5px; }
        .header-titles p { color: var(--muted); font-size: 1rem; }

        .header-widgets { display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem; }
        .ipe-badge { 
          padding: 0.6rem 1.2rem; border-radius: 30px; border: 1px solid; 
          font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 0.6rem;
        }
        .last-sync { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--muted); }

        .nexus-grid-main { display: grid; grid-template-columns: 400px 1fr; gap: 2rem; margin-bottom: 2rem; }
        
        .card { background: var(--bg-card); border-radius: 24px; border: 1px solid #3A3A3C; padding: 2rem; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .card-header h3 { font-size: 1rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 0.75rem; }
        .info-icon { color: var(--muted); cursor: help; }

        /* Gauge Nexus Style */
        .gauge-viz { display: flex; justify-content: center; margin-bottom: 2.5rem; }
        .nexus-gauge { 
          width: 240px; height: 120px; position: relative; overflow: hidden; 
          display: flex; justify-content: center; align-items: flex-end;
        }
        .gauge-bg { 
          position: absolute; width: 100%; height: 200%; border-radius: 50%; 
          border: 12px solid #1C1C1E; top: 0;
        }
        .gauge-fill {
          position: absolute; width: 100%; height: 200%; border-radius: 50%;
          border: 12px solid var(--verde-soja); top: 0; clip-path: polygon(0 50%, 100% 50%, 100% 0, 0 0);
          transform-origin: center center; transition: 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .gauge-center { position: absolute; bottom: 0; display: flex; flex-direction: column; align-items: center; }
        .ipe-value { font-size: 3.5rem; font-weight: 800; line-height: 1; }
        .ipe-value span { font-size: 1.5rem; color: var(--muted); margin-left: 2px; }
        .ipe-label { font-size: 0.75rem; font-weight: 800; color: var(--muted); margin-top: 0.5rem; letter-spacing: 2px; }

        .ipe-breakdown { display: flex; flex-direction: column; gap: 1.25rem; }
        .ipe-breakdown .item .info { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; }
        .ipe-breakdown .track { height: 6px; background: #1C1C1E; border-radius: 3px; overflow: hidden; }
        .ipe-breakdown .bar { height: 100%; border-radius: 3px; transition: 0.5s; }

        /* Chart Legends */
        .chart-legend { display: flex; gap: 1.5rem; font-size: 0.8rem; font-weight: 600; }
        .chart-legend .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; }
        .dot.soja { background: var(--verde-soja); }
        .dot.milho { background: var(--dourado); }
        .dot.arroz { background: var(--azul-nexus); }

        /* Insights Cards */
        .nexus-insights { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .insight-card { 
          background: var(--bg-card); padding: 1.5rem; border-radius: 20px; 
          display: flex; align-items: center; gap: 1.5rem; border: 1px solid #3A3A3C;
        }
        .insight-card .icon { color: var(--verde-soja); opacity: 0.8; }
        .insight-card h4 { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; margin-bottom: 0.25rem; }
        .insight-card p { font-size: 1rem; font-weight: 600; }
        .insight-card.action { background: linear-gradient(135deg, #2C2C2E 0%, #1C1C1E 100%); border-color: var(--verde-soja); }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3A3A3C; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default App;
