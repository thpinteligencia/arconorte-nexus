export const getIPEColor = (ipe: number): string => {
  if (ipe < 50) return '#34A853'; // Verde Soja
  if (ipe < 85) return '#F4A261'; // Dourado
  return '#EF4444'; // Danger
};
