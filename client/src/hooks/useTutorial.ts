import { useState, useEffect } from 'react';

export const useTutorial = (setActiveTab: (tab: string) => void) => {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isTutorialActive, setIsTutorialActive] = useState(() => {
    return localStorage.getItem('nexus_tutorial_completed') !== 'true';
  });

  const handleNextStep = () => {
    if (tutorialStep < 8) {
      if (tutorialStep === 6) {
        setActiveTab('audit');
      }
      setTutorialStep(prev => prev + 1);
    } else {
      setIsTutorialActive(false);
      localStorage.setItem('nexus_tutorial_completed', 'true');
    }
  };

  const handleRestartTutorial = () => {
    setTutorialStep(0);
    setActiveTab('dashboard');
    setIsTutorialActive(true);
    localStorage.removeItem('nexus_tutorial_completed');
  };

  useEffect(() => {
    (window as any).finishTutorial = () => {
      setIsTutorialActive(false);
      localStorage.setItem('nexus_tutorial_completed', 'true');
    };
    (window as any).restartTutorial = handleRestartTutorial;
  }, []);

  return {
    tutorialStep,
    isTutorialActive,
    handleNextStep,
    handleRestartTutorial
  };
};
