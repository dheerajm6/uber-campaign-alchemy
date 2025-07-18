import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type UserSegment = Tables['user_segments']['Row'];

interface CampaignContextType {
  selectedUsers: User[];
  setSelectedUsers: (users: User[]) => void;
  selectedSegment: UserSegment | null;
  setSelectedSegment: (segment: UserSegment | null) => void;
  clearSelection: () => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaignContext must be used within a CampaignProvider');
  }
  return context;
};

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<UserSegment | null>(null);

  const clearSelection = () => {
    setSelectedUsers([]);
    setSelectedSegment(null);
  };

  return (
    <CampaignContext.Provider
      value={{
        selectedUsers,
        setSelectedUsers,
        selectedSegment,
        setSelectedSegment,
        clearSelection,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};