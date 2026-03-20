import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ViewingStatus, ViewingAgreementRecord, MaintenanceTicket, Listing } from '@/types';

interface DemoState {
  viewingOverrides: Record<string, ViewingStatus>;
  agreementOverrides: Record<string, ViewingAgreementRecord>;
  signatureOverrides: Record<string, { agentSigned: boolean; tenantSigned: boolean; agentSignatureData?: string; tenantSignatureData?: string }>;
  kycSubmissions: Record<string, 'pending' | 'approved' | 'rejected'>;
  tierOverrides: Record<string, string>;
  occupancyOverrides: Record<string, number>;
  applicantDecisions: Record<string, 'approved' | 'rejected'>;
  maintenanceTickets: MaintenanceTicket[];
  newListings: Listing[];
}

const initial: DemoState = {
  viewingOverrides: {},
  agreementOverrides: {},
  signatureOverrides: {},
  kycSubmissions: {},
  tierOverrides: {},
  occupancyOverrides: {},
  applicantDecisions: {},
  maintenanceTickets: [],
  newListings: [],
};

interface DemoContextType {
  demoState: DemoState;
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>;
  resetDemoState: () => void;
}

const DemoStateContext = createContext<DemoContextType>({
  demoState: initial,
  setDemoState: () => {},
  resetDemoState: () => {},
});

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoState] = useState<DemoState>(initial);
  const resetDemoState = () => setDemoState(initial);
  return (
    <DemoStateContext.Provider value={{ demoState, setDemoState, resetDemoState }}>
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState() {
  return useContext(DemoStateContext);
}
