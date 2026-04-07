/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface BranchContextType {
  currentBranchId: string | null;
  setBranchId: (id: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentBranchId, setCurrentBranchId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('currentBranchId');
    if (saved) {
      setCurrentBranchId(saved);
    }
  }, []);

  const setBranchId = (id: string) => {
    setCurrentBranchId(id);
    localStorage.setItem('currentBranchId', id);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <BranchContext.Provider value={{ currentBranchId, setBranchId }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranchContext = () => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranchContext must be used within a BranchProvider');
  }
  return context;
};