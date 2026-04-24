import React, { useEffect } from 'react';
import { ChevronRight, CheckCircle2, Trophy, Play } from 'lucide-react';
import styles from './TutorialOverlay.module.css';

interface TutorialStep {
  title: string;
  description: string;
  target: string;
}

const STEPS: TutorialStep[] = [
  {
    title: "Bem-vindo ao Nexus",
    description: "Sua plataforma de inteligência logística para o Arco Norte. Vamos transformar dados em estratégia?",
    target: "tutorial-welcome"
  },
  {
    title: "Foco Regional",
    description: "Selecione o Estado. Hoje focaremos em Roraima, o coração do escoamento setentrional.",
    target: "tutorial-header"
  },
  {
    title: "Simule a Safra",
    description: "Ajuste o volume esperado de Soja. O motor de IA Nexus recalculará o impacto imediatamente.",
    target: "tutorial-vol-slider"
  },
  {
    title: "Capacidade de Escoamento",
    description: "Defina a capacidade estática do Porto Seco para identificar gargalos logísticos.",
    target: "tutorial-cap-slider"
  },
  {
    title: "O Insight do IPE",
    description: "Observe o Gauge de Pressão. Se estiver em vermelho, o porto está saturado nos picos de safra.",
    target: "tutorial-ipe-card"
  },
  {
    title: "Gere Valor Tangível",
    description: "Exporte este cenário como um Boletim Estratégico em PDF para seus stakeholders.",
    target: "tutorial-report-btn"
  },
  {
    title: "Auditoria e Confiança",
    description: "Mude para a aba de Auditoria para ver o 'DNA' da IA e logs de precisão (RMSE/MAE).",
    target: "tutorial-audit-tab"
  }
];

interface TutorialOverlayProps {
  currentStep: number;
  onNext: () => void;
  isActive: boolean;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ currentStep, onNext, isActive }) => {
  useEffect(() => {
    console.log("Tutorial Status:", { isActive, currentStep });
    if (!isActive) {
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
      return;
    }

    const step = STEPS[currentStep];
    if (step && step.target) {
      console.log("Highlighting target:", step.target);
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });

      const targetEl = document.getElementById(step.target);
      if (targetEl) {
        targetEl.classList.add('tutorial-highlight');
      } else {
        console.warn("Target element not found:", step.target);
      }
    }
  }, [currentStep, isActive]);

  if (!isActive) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  return (
    <div className={styles.tutorialWrapper}>
      <div className={styles.tutorialCard}>
        <div className={styles.stepIndicator}>
          Passo {currentStep + 1} de {STEPS.length}
        </div>
        
        <h3>{step.title}</h3>
        <p>{step.description}</p>

        <button className={styles.nextBtn} onClick={onNext}>
          {isLast ? (
            <>Finalizar Jornada <Trophy size={18} /></>
          ) : (
            <>Próximo Passo <ChevronRight size={18} /></>
          )}
        </button>

        <button className={styles.skipBtn} onClick={() => (window as any).finishTutorial()}>
          Pular Guia
        </button>

        <div className={styles.progressDots}>
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`${styles.dot} ${i <= currentStep ? styles.activeDot : ''}`}
            />
          ))}
        </div>
      </div>
      
      {/* Overlay de destaque (Simulado por CSS no step.target) */}
    </div>
  );
};

export default TutorialOverlay;
