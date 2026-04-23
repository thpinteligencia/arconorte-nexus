import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import TutorialOverlay from './components/layout/TutorialOverlay';
import IpeCard from './components/dashboard/IpeCard';
import PredictionChart from './components/dashboard/PredictionChart';
import SimulatorPanel from './components/dashboard/SimulatorPanel';
import AuditPanel from './components/dashboard/AuditPanel';
import { UFS_NAMES } from './constants';
import { PredictionData } from './types';
import { MOCK_PREDICTIONS, MOCK_REGISTRY } from './utils/mockData';
import { AlertCircle, Loader2, ZapOff } from 'lucide-react';
import styles from './App.module.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- Estados do Tutorial ---
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isTutorialActive, setIsTutorialActive] = useState(() => {
    return !localStorage.getItem('nexus_tutorial_completed');
  });

  const handleNextStep = () => {
    if (tutorialStep < 6) {
      setTutorialStep(prev => prev + 1);
    } else {
      setIsTutorialActive(false);
      localStorage.setItem('nexus_tutorial_completed', 'true');
    }
  };

  useEffect(() => {
    (window as any).finishTutorial = () => {
      setIsTutorialActive(false);
      localStorage.setItem('nexus_tutorial_completed', 'true');
    };
  }, []);

  // --- Estados do Simulador ---
  const [selectedUf, setSelectedUf] = useState("14");
  const [availableUfs, setAvailableUfs] = useState<string[]>(["14"]);
  const [volSoja, setVolSoja] = useState(1.0); 
  const [capacidadePorto, setCapacidadePorto] = useState(70000);

  // --- Estados de Dados ---
  const [data, setData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMocking, setIsMocking] = useState(false);

  // --- Busca de Registro (Disponibilidade) ---
  useEffect(() => {
    fetch('/api/v1/registry', {
      headers: { 'X-API-Key': import.meta.env.VITE_NEXUS_API_KEY || 'nexus_dev_2026' }
    })
      .then(res => res.json())
      .then(registry => {
        const ufs = Object.keys(registry["12019000"] || {});
        if (ufs.length > 0) setAvailableUfs(ufs);
      })
      .catch(() => {
        console.warn("⚠️ Usando registro mockado");
        const ufs = Object.keys(MOCK_REGISTRY["12019000"]);
        setAvailableUfs(ufs);
      });
  }, []);

  // --- Busca de Predições (Debounced logic) ---
  const fetchPredictions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/predict/soja', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_NEXUS_API_KEY || 'nexus_dev_2026'
        },
        body: JSON.stringify({
          uf: selectedUf,
          capacity: capacidadePorto,
          volSoja: volSoja
        })
      });
      
      if (!response.ok) throw new Error('Falha na resposta do motor Nexus');
      const result = await response.json();
      setData(result);
      setIsMocking(false);
    } catch (err: any) {
      console.warn("⚠️ Ativando modo de simulação (Mock Fallback)");
      setData(MOCK_PREDICTIONS as any);
      setIsMocking(true);
      // setError(err.message || 'Erro de conexão com o backend');
    } finally {
      setIsLoading(false);
    }
  }, [selectedUf, capacidadePorto, volSoja]);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchPredictions(), 500);
    return () => clearTimeout(timeoutId);
  }, [fetchPredictions]);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/v1/report/pdf', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_NEXUS_API_KEY || 'nexus_dev_2026'
        },
        body: JSON.stringify({
          uf: selectedUf,
          capacity: capacidadePorto,
          volSoja: volSoja
        })
      });
      
      if (!response.ok) throw new Error('Falha ao gerar boletim');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ufName = UFS_NAMES[selectedUf as keyof typeof UFS_NAMES] || selectedUf;
      a.download = `Boletim_Nexus_${ufName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Erro ao baixar relatório: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div id="tutorial-welcome" className={styles.nexusContainer}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className={styles.nexusMain}>
        <Header 
          selectedUf={selectedUf}
          setSelectedUf={setSelectedUf}
          availableUfs={availableUfs}
          currentIPE={data?.overallIPE || 0}
          isLoading={isLoading}
          ufsNames={UFS_NAMES}
        />
        
        <div className={styles.nexusContent}>
          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={20} />
              <span>{error}</span>
              <button onClick={() => fetchPredictions()}>Tentar Novamente</button>
            </div>
          )}

          {activeTab === 'dashboard' ? (
            <div className="animate-fade">
              <header className={styles.dashboardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h2>Dashboard de Inteligência</h2>
                  {isMocking && (
                    <div style={{ 
                      background: 'rgba(241, 196, 15, 0.1)', 
                      color: 'var(--accent)', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '6px', 
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      border: '1px solid rgba(241, 196, 15, 0.2)',
                      textTransform: 'uppercase'
                    }}>
                      <ZapOff size={12} /> Modo Simulação
                    </div>
                  )}
                </div>
                <p>Análise preditiva de escoamento e pressão logística para o Arco Norte.</p>
              </header>

              <div className={styles.nexusGridMain}>
                <SimulatorPanel 
                  selectedUf={selectedUf}
                  setSelectedUf={setSelectedUf}
                  availableUfs={availableUfs}
                  volSoja={volSoja}
                  setVolSoja={setVolSoja}
                  capacidadePorto={capacidadePorto}
                  setCapacidadePorto={setCapacidadePorto}
                  onDownload={handleDownloadReport}
                  isDownloading={isDownloading}
                />
                
                <div style={{ position: 'relative' }}>
                  {isLoading && (
                    <div className={styles.loadingOverlay}>
                      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
                    </div>
                  )}
                  
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <IpeCard 
                      ipe={data?.overallIPE || 0} 
                      pico={data?.picoTotal || 0}
                      uf={UFS_NAMES[selectedUf as keyof typeof UFS_NAMES] || selectedUf}
                    />
                    <PredictionChart data={data?.chartData || []} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AuditPanel />
          )}
        </div>
      </main>

      <TutorialOverlay 
        currentStep={tutorialStep} 
        onNext={handleNextStep} 
        isActive={isTutorialActive} 
      />
    </div>
  );
};

export default App;
