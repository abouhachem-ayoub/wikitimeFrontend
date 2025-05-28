import { createContext, useEffect, useState } from 'react';

interface TimePanelContext {
  timePanelHeight: number;
  setTimePanelHeight: (height: number) => void;
  timeBoxHeight: number;
  setTimeBoxHeight: (height: number) => void;
}

export const ContextTimePanel = createContext<TimePanelContext | undefined>(undefined);

export const TimePanelProvider = ({ children }: { children: React.ReactNode }) => {
  const [timePanelHeight, setTimePanelHeight] = useState(150);
  const [timeBoxHeight, setTimeBoxHeight] = useState(100);

  return (
    <ContextTimePanel.Provider
      value={{
        timePanelHeight,
        setTimePanelHeight,
        timeBoxHeight,
        setTimeBoxHeight,
      }}
    >
      {children}
    </ContextTimePanel.Provider>
  );
};
