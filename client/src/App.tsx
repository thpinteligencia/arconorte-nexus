import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import TutorialOverlay from './components/layout/TutorialOverlay';
import IpeCard from './components/dashboard/IpeCard';
import PredictionChart from './components/dashboard/PredictionChart';
import SimulatorPanel from './components/dashboard/SimulatorPanel';
import AuditPanel from './components/dashboard/AuditPanel';
import { UFS_NAMES } from './constants';
import { AlertCircle, Loader2, ZapOff } from 'lucide-react';
import styles from './App.module.css';

// Hooks extraídos
import { useTutorial } from './hooks/useTutorial';
import { useSimulator } from './hooks/useSimulator';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Custom Hooks
  const { 
    tutorialStep, 
    isTutorialActive, 
    handleNextStep, 
    handleRestartTutorial 
  } = useTutorial(setActiveTab);

  const {
    selectedUf, setSelectedUf,
    availableUfs,
    volSoja, setVolSoja,
    capacidadePorto, setCapacidadePorto,
    data,
    isLoading,
    isDownloading,
    error,
    isMocking,
    handleDownloadReport,
    fetchPredictions
  } = useSimulator();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'simulacao':
        return (
          <div className="animate-fade">
            <header className={styles.dashboardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2>{activeTab === 'dashboard' ? 'Painel de Controle' : 'Simulador Estratégico'}</h2>
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
        );
      case 'audit':
        return <AuditPanel />;
      case 'reports':
        return (
          <div className="animate-fade" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <header className={styles.dashboardHeader}>
              <h2>Relatórios Estratégicos</h2>
            </header>
            <div className="glass-card" style={{ padding: '4rem', marginTop: '2rem' }}>
              <p>Módulo de relatórios consolidados em desenvolvimento.</p>
              <button 
                onClick={handleDownloadReport} 
                className={styles.nextBtn} 
                style={{ marginTop: '1.5rem', padding: '0.8rem 2rem' }}
                disabled={isDownloading}
              >
                {isDownloading ? 'Gerando...' : 'Gerar Boletim Situacional (PDF)'}
              </button>
            </div>
          </div>
        );
      default:
        return <div>Em construção...</div>;
    }
  };

  return (
    <div id="tutorial-welcome" className={styles.nexusContainer}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onRestartTutorial={handleRestartTutorial}
      />
      
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
          {renderContent()}
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
