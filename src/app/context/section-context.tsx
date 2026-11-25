'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

interface SectionContextType {
  sectionId: string;
  addSection: (id: string) => void;
}

const SectionContext = createContext({} as SectionContextType);

export function SectionProvider({ children }: { children: ReactNode }) {
  const [sectionId, setSectionId] = useState('');

  function addSection(id: string) {
    setSectionId(id);
  }

  return (
    <SectionContext.Provider value={{ sectionId: sectionId, addSection }}>
      {children}
    </SectionContext.Provider>
  );
}

export const useSection = () => useContext(SectionContext)