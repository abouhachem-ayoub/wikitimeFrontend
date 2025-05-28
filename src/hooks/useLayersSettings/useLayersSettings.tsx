import { useLocalStorage } from '@uidotdev/usehooks';
import React, { createContext, FC, ReactNode, useContext, useEffect, useReducer, useState } from 'react';

import { Layer, SettingsLayerType } from '../../types/pastbar';
import { PastBarConfig } from '../usePastBarDataV2/config';

interface LayersContextType {
  visibilityConfig: SettingsLayerType[];
  toggleVisibility: (name: Layer, visible: boolean) => void;
  getVisibility: (name: string) => boolean;
  pastBarSettings: PastBarConfig;
  setPastBarSettings: React.Dispatch<React.SetStateAction<PastBarConfig>>;
  animationDuration: number;
  setAnimationDuration: React.Dispatch<React.SetStateAction<number>>;
}

const LayersContext = createContext<LayersContextType>(undefined);

export const useLayersSettings = () => {
  const context = useContext(LayersContext);
  if (!context) {
    throw new Error('useLayersSettings must be used within a LayersSettingsProvider');
  }
  return context;
};

interface LayersProviderProps {
  children: ReactNode;
}

export const LayersSettingsProvider: FC<LayersProviderProps> = ({ children }) => {
  const [visibilityConfig, setVisibilityConfig] = useLocalStorage<SettingsLayerType[]>(
    'layers',
    [
      {
        name: Layer.tMStamp,
        visible: true
      },
      {
        name: Layer.tMDate,
        visible: true
      },
      {
        name: Layer.pastBar,
        visible: true
      }
    ]
  );

  const [pastBarSettings, setPastBarSettings] = useLocalStorage<PastBarConfig>(
    'pastBarSettings',
    {
      pastBarMobileOffset: 50,
      pastBarDesktopOffset: 100
    }
  );

  const [animationDuration, setAnimationDuration] = useLocalStorage(
    'animationDuration', 1000
  );

  const toggleVisibility = (name: Layer, visible: boolean) => {
    setVisibilityConfig(visibilityConfig.map((layer) => {
      if (layer.name === name) {
        return {
          ...layer,
          visible: visible
        };
      }
      return layer;
    }));
  };

  const getVisibility = (name: string) => {
    return visibilityConfig.find((layer) => layer.name === name)?.visible ?? false;
  };

  return (
    <LayersContext.Provider
      value={{
        toggleVisibility,
        visibilityConfig,
        getVisibility,
        pastBarSettings,
        setPastBarSettings,
        animationDuration,
        setAnimationDuration
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};
