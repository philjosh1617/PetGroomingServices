import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Service {
  serviceName: string;
  price: number;
}

interface AppointmentData {
  petId: string;
  petName: string;
  services: Service[];
  appointmentDate: string;
  appointmentDay: string;
  appointmentTime: string;
  totalAmount: number;
  paymentMethod: 'CREDIT_CARD' | 'OVER_THE_COUNTER' | null;
}

interface AppointmentContextType {
  appointmentData: AppointmentData;
  updateAppointmentData: (data: Partial<AppointmentData>) => void;
  resetAppointmentData: () => void;
}

const initialAppointmentData: AppointmentData = {
  petId: '',
  petName: '',
  services: [],
  appointmentDate: '',
  appointmentDay: '',
  appointmentTime: '',
  totalAmount: 0,
  paymentMethod: null,
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointmentData, setAppointmentData] = useState<AppointmentData>(initialAppointmentData);

  const updateAppointmentData = (data: Partial<AppointmentData>) => {
    setAppointmentData((prev) => ({ ...prev, ...data }));
  };

  const resetAppointmentData = () => {
    setAppointmentData(initialAppointmentData);
  };

  return (
    <AppointmentContext.Provider value={{ appointmentData, updateAppointmentData, resetAppointmentData }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentContext must be used within AppointmentProvider');
  }
  return context;
};

export default AppointmentProvider;