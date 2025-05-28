import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

import { ZoomScale } from '../../config/zoomscale';
import { dateMarkType, TimeBoxType, TimePeriodType } from '../../types/pastbar';
import { usePastBarData } from '../usePastBarDataV2/usePastBarData';
import { renderPositionByTimestamp } from '../usePastBarDataV2/utils';

interface PBContextType {
  timeBoxList: TimeBoxType[];
  periods: TimePeriodType[];
  setPeriods: React.Dispatch<React.SetStateAction<TimePeriodType[]>>;
}

const PBContext = createContext<PBContextType>(undefined);

export const useTimeBoxPosition = () => {
  const context = useContext(PBContext);
  if (!context) {
    throw new Error('useTimeBoxPosition must be used within a TimeBoxPositionProvider');
  }
  return context;
};

interface TBProviderProps {
  children: ReactNode;
}

export const TimeBoxPositionProvider: FC<TBProviderProps> = ({ children }) => {
  const {
    currentZoomScaleData,
    forceRenderDMs,
    totalOffset,
    offsetDisplacement,
    dateMarkInterval,
    closestDateMarkData,
    datejs,
  } = usePastBarData();
  const [periods, setPeriods] = useState<TimePeriodType[]>([{ startTs: 1500, endTs: 1800 }]);
  const [timeBoxList, setTimeBoxList] = useState<TimeBoxType[]>([]);

  const generateTimeBoxes = () => {
    const newTimeBoxList = periods.map((period) => {
      const { startTs, endTs } = period;
      const x = renderPositionByTimestamp(datejs(startTs), currentZoomScaleData, closestDateMarkData.current, dateMarkInterval);
      const width = renderPositionByTimestamp(datejs(endTs), currentZoomScaleData, closestDateMarkData.current, dateMarkInterval) - x;
      return { x, width, startTs, endTs };
    });
    setTimeBoxList(newTimeBoxList);
  };

  useEffect(() => {
    generateTimeBoxes();
  }, [currentZoomScaleData, forceRenderDMs]);

  return (
    <PBContext.Provider value={{
      timeBoxList,
      periods,
      setPeriods
    }}>
      {children}
    </PBContext.Provider>
  );
};
