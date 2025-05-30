
import { useState, useEffect } from 'react';

export const useCommandBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      

      if (e.key === '/' && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    setIsOpen
  };
};
