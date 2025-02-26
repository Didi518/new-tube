import { useCallback } from 'react';

export const useFormatUserName = () => {
  const formatUserName = useCallback((name: string) => {
    return name.replace(/\snull$/, '') || 'Utilisateur inconnu';
  }, []);

  return formatUserName;
};
