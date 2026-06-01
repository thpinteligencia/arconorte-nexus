import { useState, useEffect, useCallback } from 'react';
import { PredictionData } from '../types';
import { MOCK_PREDICTIONS, MOCK_REGISTRY } from '../utils/mockData';
import { UFS_NAMES } from '../constants';

export const useSimulator = () => {
  const [selectedUf, setSelectedUf] = useState("14");
  const [availableUfs, setAvailableUfs] = useState<string[]>(["14"]);
  const [volSoja, setVolSoja] = useState(1.0); 
  const [capacidadePorto, setCapacidadePorto] = useState(70000);

  const [data, setData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMocking, setIsMocking] = useState(false);

  // --- Busca de Registro ---
  useEffect(() => {
    fetch('/api/v1/registry')
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

  // --- Busca de Predições ---
  const fetchPredictions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/predict/soja', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uf: selectedUf,
          capacity: capacidadePorto,
          volSoja: volSoja
        })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Falha ao gerar boletim');
      }
      
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const ufName = UFS_NAMES[selectedUf as keyof typeof UFS_NAMES] || selectedUf;
      a.download = `Boletim_Nexus_${ufName}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err: any) {
      console.error("Erro no download:", err);
      alert("Erro ao baixar relatório: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
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
  };
};
