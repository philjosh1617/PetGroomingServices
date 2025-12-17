import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PetData {
  name: string;
  breed: string;
  age: string;
  gender: 'BOY' | 'GIRL' | null;
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'XLARGE' | null;
  medicalCondition: string;
  behavioralConcern: string;
  treat: string;
  rabiesExpiry: string;
  profileImage?: string;
}

interface PetContextType {
  petData: PetData;
  updatePetData: (data: Partial<PetData>) => void;
  resetPetData: () => void;
}

const initialPetData: PetData = {
  name: '',
  breed: '',
  age: '',
  gender: null,
  size: null,
  medicalCondition: '',
  behavioralConcern: '',
  treat: '',
  rabiesExpiry: '',
};

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider = ({ children }: { children: ReactNode }) => {
  const [petData, setPetData] = useState<PetData>(initialPetData);

  const updatePetData = (data: Partial<PetData>) => {
    setPetData((prev) => ({ ...prev, ...data }));
  };

  const resetPetData = () => {
    setPetData(initialPetData);
  };

  return (
    <PetContext.Provider value={{ petData, updatePetData, resetPetData }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePetContext must be used within PetProvider');
  }
  return context;
};

export default PetProvider;