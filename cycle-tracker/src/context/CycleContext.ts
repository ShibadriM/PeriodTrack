import React, { createContext, useContext, useState, useEffect } from 'react';
import { cycleService } from '../services/api';

interface PeriodLog {
  startDate: string;
  endDate: string;
  flow: 'light' | 'medium' | 'heavy';
}

interface Symptom {
  date: string;
  type: string;
  severity: number;
}

interface CycleData {
  lastPeriodStart: string;
  cycleLength: number;
  periodLength: number;
  periodLogs: PeriodLog[];
  symptoms: Symptom[];
}

interface CycleContextType {
  cycleData: CycleData | null;
  loading: boolean;
  logPeriod: (startDate: string, endDate: string, flow: string) => Promise<void>;
  logSymptoms: (date: string, type: string, severity: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultContext: CycleContextType = {
  cycleData: null,
  loading: false,
  logPeriod: async () => {},
  logSymptoms: async () => {},
  refresh: async () => {}
};

export const CycleContext = createContext<CycleContextType>(defaultContext);

interface CycleProviderProps {
  children: React.ReactNode;
}

export const CycleProvider: React.FC<CycleProviderProps> = ({ children }) => {
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await cycleService.getCycleData();
      setCycleData(data);
    } catch (e) {
      setCycleData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const logPeriod = async (startDate: string, endDate: string, flow: string) => {
    await cycleService.logPeriod({ startDate, endDate, flow });
    await refresh();
  };

  const logSymptoms = async (date: string, type: string, severity: number) => {
    await cycleService.logSymptoms({ date, type, severity });
    await refresh();
  };

  const value = {
    cycleData,
    loading,
    logPeriod,
    logSymptoms,
    refresh
  };

  return React.createElement(CycleContext.Provider, { value }, children);
};

export const useCycleData = () => {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error('useCycleData must be used within a CycleProvider');
  }
  return context;
};
