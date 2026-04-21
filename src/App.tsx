import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import IpeCard from './components/dashboard/IpeCard';
import PredictionChart from './components/dashboard/PredictionChart';
import SimulatorPanel from './components/dashboard/SimulatorPanel';
import AuditPanel from './components/dashboard/AuditPanel';
import { getIPEColor } from './utils';
import { UFS_NAMES } from './constants';
import { PredictionData } from './types';
import { AlertCircle } from 'lucide-react';
import styles from './App.module.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
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

  // --- Busca de Registro (Disponibilidade) ---
  useEffect(() => {
    fetch('/api/v1/registry', {
      headers: { 'X-API-Key': 'nexus_dev_2026' }
    })
      .then(res => res.json())
      .then(registry => {
        // Pega as UFs que possuem o modelo de Soja (12019000) ativo
        const ufs = Object.keys(registry["12019000"] || {});
        if (ufs.length > 0) setAvailableUfs(ufs);
      })
      .catch(() => console.error("Falha ao carregar registro de modelos"));
  }, []);

  // --- Busca de Predições (Integration) ---
  const fetchPredictions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/predict/soja', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': 'nexus_dev_2026'
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
    } catch (err: any) {
      setError(err.message || 'Erro de conexão com o backend');
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
          'X-API-Key': 'nexus_dev_2026'
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
      alert(err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const currentIPE = data?.overallIPE || 0;
  const chartData = data?.chartData || [];
  
  let soyProp = 0;
  if (chartData.length > 0) {
    const peakMonth = chartData.reduce((p: any, c: any) => (c.total > p.total) ? c : p, chartData[0]);
    if (peakMonth.total > 0) {
      soyProp = Math.round((peakMonth.soja / peakMonth.total) * 100);
    }
  }

  return (
    <div className={styles.nexusContainer}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className={styles.nexusMain}>
        <Header 
          selectedUf={selectedUf}
          setSelectedUf={setSelectedUf}
          availableUfs={availableUfs}
          currentIPE={currentIPE}
          isLoading={isLoading}
          ufsNames={UFS_NAMES}
          getIPEColor={getIPEColor}
        />

        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => fetchPredictions()}>Tentar Novamente</button>
          </div>
        )}

        <div className={`${styles.nexusContent} ${isLoading ? styles.loadingState : ''}`}>
          {activeTab === 'dashboard' ? (
            <>
              <div className={styles.nexusGridMain}>
                <IpeCard 
                  currentIPE={currentIPE}
                  soyProp={soyProp}
                  getIPEColor={getIPEColor}
                />

                <PredictionChart 
                  chartData={chartData} 
                />
              </div>
              
              <div style={{ marginTop: '2rem' }}>
                <SimulatorPanel 
                  volSoja={volSoja}
                  setVolSoja={setVolSoja}
                  capacidadePorto={capacidadePorto}
                  setCapacidadePorto={setCapacidadePorto}
                  onDownloadReport={handleDownloadReport}
                  isDownloading={isDownloading}
                />
              </div>
            </>
          ) : (
            <AuditPanel />
          )}
        </div>
      </main>
    </div>
  );
};
export default App;
