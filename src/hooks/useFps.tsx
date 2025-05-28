import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

interface FpsContextType {
  fps: number;
  updateFps: () => void;
}

// Create context
const FpsContext = createContext<FpsContextType | undefined>(undefined);

// Custom hook to consume FPS data
export const useFps = (): FpsContextType => {
  const context = useContext(FpsContext);
  if (!context) {
    throw new Error('useFps must be used within an FpsProvider');
  }
  return context;
};

// FPS Provider component
export const FpsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fps, setFps] = useState<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  const updateFps = () => {
    const now = performance.now();
    frameCountRef.current++;

    if (now - lastTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  };

  return (
    <FpsContext.Provider value={{ fps, updateFps }}>
      {children}
    </FpsContext.Provider>
  );
};
