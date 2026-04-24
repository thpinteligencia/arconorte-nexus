import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/* 
  Ícones extraídos visualmente de arconorte nexus7.png
  Estilo: Traço técnico, bi-color (Stroke principal + detalhes esmeralda)
*/

export const IconSilo: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M4 20V9L12 5L20 9V20H4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 20V13H16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 5V3H21V11H18" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="19" y="5" width="1" height="4" fill="#2ECC71"/>
  </svg>
);

export const IconSoja: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M12 4C12 4 17 6 17 12C17 18 12 20 12 20C12 20 7 18 7 12C7 6 12 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="1.5" fill="#2ECC71"/>
    <circle cx="12" cy="12" r="1.5" fill="#2ECC71"/>
    <circle cx="12" cy="16" r="1.5" fill="#2ECC71"/>
  </svg>
);

export const IconFluxo: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M4 14H14V20H4V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14V8C12 5 15 4 18 4H20" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 7L20 4L17 1" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconDashboard: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 10V21" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="15.5" r="2.5" stroke="#2ECC71" strokeWidth="2"/>
    <path d="M6 14H8V18H6V14Z" fill="#2ECC71"/>
  </svg>
);

export const IconAudit: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconReport: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 13H16" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 17H12" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const IconGauge: React.FC<IconProps> = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M20 18C21.2523 16.2874 22 14.2274 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.2274 2.74773 16.2874 4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 12L16 8" stroke="#2ECC71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <rect x="10" y="18" width="4" height="2" rx="1" fill="#2ECC71"/>
  </svg>
);
