import { useLayersSettings } from 'hooks/useLayersSettings/useLayersSettings';
import yearjs from 'modules/yearjs';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { ZoomScale, ZoomScaleList } from '../../config/zoomscale';
import { dateMarkType } from '../../types/pastbar';
import {
  renderPositionByTimestamp,
  useFindDM
} from './utils';

dayjs.extend(duration);

interface PBContextType {
  forceRenderDMs: number;
  currentZoomScaleData: ZoomScale;
  dateMarkInterval: number;
  dateMarkList: dateMarkType[];
  setDateMarkList: React.Dispatch<React.SetStateAction<dateMarkType[]>>;
  setPastBarCrd: React.Dispatch<React.SetStateAction<[number | undefined, number | undefined]>>;
  setCurrentZoomScaleData: React.Dispatch<React.SetStateAction<ZoomScale>>;
  pastBarCrd: [number | undefined, number | undefined];
  jumpToZoomScale: (zoomScale: ZoomScale) => void;
  handleZoom: (direction: 'in' | 'out', positionX: number) => void;
  totalOffset: React.MutableRefObject<number>;
  forceUpdateDMs: () => void;
  zoomOffset: React.MutableRefObject<number>;
  closestDateMarkData: React.MutableRefObject<{ name: string; x: number; cursorX: number }>;
  offsetDisplacement: React.MutableRefObject<number | undefined>;
  datejs: typeof dayjs | typeof yearjs;
}

const PBContext = createContext<PBContextType | undefined>(undefined);

export const usePastBarData = () => {
  const context = useContext(PBContext);
  if (!context) {
    throw new Error('usePastBarData must be used within a PastBarDataProvider');
  }
  return context;
};

interface PBProviderProps {
  children: ReactNode;
}

const pastBarDefault: [number, number] = [-3000, 3000];

export const PastBarDataProvider: FC<PBProviderProps> = ({ children }) => {
  const [currentZoomScaleData, setCurrentZoomScaleData] = useState<ZoomScale>(ZoomScaleList[0]);
  const datejs = useMemo(() => currentZoomScaleData.date.unit !== 'year' ? dayjs : yearjs, []);
  const { animationDuration } = useLayersSettings();
  const [dateMarkList, setDateMarkList] = useState<dateMarkType[]>([]);
  const { pastBarSettings } = useLayersSettings();
  const [dateMarkInterval, setDateMarkInterval] = useState<number>(100);
  const closestDateMarkData = useRef<{ name: string; x: number; cursorX: number }>({ name: '0', x: 0, cursorX: 0 });
  const [pastBarCrd, setPastBarCrd] = useState<[number | undefined, number | undefined]>([undefined, undefined]);
  const totalOffset = useRef<number>(0);
  const {
    findZeroDM,
    findTodayDM,
    findBigBangDM
  } = useFindDM(dateMarkInterval);
  const [forceRenderDMs, forceUpdateDMs] = useReducer((s) => s + 1, 0);

  const offsetDisplacement = useRef<number | undefined>(undefined);
  const renderBorders = useRef<[number, number]>([-window.innerWidth * 2, window.innerWidth * 3]);
  const zoomOffset = useRef<number>(0);

  const isDateMarkValid = (dateMark: dateMarkType) => {
    return datejs(dateMark.timestamp).isValid();
  };

  const generateDateMarks = () => {
    const newIntervalPx = currentZoomScaleData.intervalMultiplier ? currentZoomScaleData.intervalMultiplier * dateMarkInterval : dateMarkInterval;

    const generateDM = (i: number) => {
      const tsStep = currentZoomScaleData.frequency * currentZoomScaleData.date.value;
      const dmsOnScreen = Math.ceil(window.innerWidth / newIntervalPx);
      const tsInterval = tsStep * (Math.max(Math.ceil(totalOffset.current / newIntervalPx), 0)) + dmsOnScreen * tsStep * 2;
      let startTs = Number(closestDateMarkData?.current?.name) || 0;

      while (startTs % tsStep !== 0) {
        startTs += (startTs % tsStep) > (tsStep / 2) ? (tsStep - startTs % tsStep) : -(startTs % tsStep);
      }

      const currentTs = startTs - tsInterval + i * tsStep;
      const currentX = renderPositionByTimestamp(datejs(currentTs), currentZoomScaleData, closestDateMarkData?.current, newIntervalPx);

      return {
        timestamp: currentTs,
        x: currentX,
      };
    };

    const realOffset = totalOffset.current + (offsetDisplacement.current || 0);
    const dateMarks: dateMarkType[] = [];
    const pastBarEndXNew: PBContextType['pastBarCrd'] = Object.assign({}, pastBarDefault);

    let i = 0;
    let newDmX: undefined | number = undefined;
    while (newDmX === undefined || (newDmX + realOffset) < renderBorders.current[1]) {
      // rendering date marks while they are in the visible area
      const newDateMark = generateDM(i);
      const nextDateMark = generateDM(i + 1);
      if (isDateMarkValid(newDateMark)) {
        dateMarks.push(newDateMark);
        if (!isDateMarkValid(nextDateMark)) {
          pastBarEndXNew[1] = newDateMark.x;
        }
      } else if (isDateMarkValid(nextDateMark)) {
        pastBarEndXNew[0] = nextDateMark.x;
      }
      newDmX = newDateMark.x;
      i++;
    }
    const todayDM = findTodayDM(dateMarks, currentZoomScaleData, closestDateMarkData.current);
    const zeroDM = findZeroDM(todayDM ? [...dateMarks, todayDM] : dateMarks, currentZoomScaleData, closestDateMarkData.current);
    const bigBangDM = findBigBangDM(dateMarks, currentZoomScaleData, closestDateMarkData.current);
    if (todayDM) {
      if (zeroDM && Math.abs(todayDM.x - zeroDM.x) < newIntervalPx) {
        todayDM.isTooClose = true;
      }
      if (!todayDM.isTooClose) {
        dateMarks.push(todayDM);
      }
      if (todayDM.x >= dateMarks?.[dateMarks.length - 1]?.x) {
        pastBarEndXNew[1] = todayDM.x;
      }
    }
    if (zeroDM && !zeroDM.isTooClose && Math.abs(zeroDM.x) < 10 * 1000) dateMarks.push(zeroDM);
    if (bigBangDM) {
      if (pastBarEndXNew[0] && bigBangDM.x < pastBarEndXNew[0]) {
        pastBarEndXNew[0] = bigBangDM.x;
      }
    }
    if (dateMarks?.[dateMarks.length - 1]?.x > pastBarEndXNew[1]!) {
      pastBarEndXNew[1] = dateMarks[dateMarks.length - 1].x;
    }
    if (pastBarEndXNew[1]! + totalOffset.current < 0) {
      zoomOffset.current = -totalOffset.current;
    }

    setTimeout(() => {
      if (!offsetDisplacement.current && dateMarks?.[0]) {
        offsetDisplacement.current = dateMarks[0].x;
      }
      setPastBarCrd(pastBarEndXNew);
      setDateMarkList(dateMarks);
    }, 0);
    return dateMarks;
  };

  const jumpToZoomScale = (zoomScale: ZoomScale, posTs?: number): void => {
    setCurrentZoomScaleData(zoomScale);
    zoomOffset.current += 1;
  };

  const handleZoom = (direction: 'in' | 'out', positionX: number): void => {
    const newZoomScale = ZoomScaleList[currentZoomScaleData.id + (direction === 'in' ? 1 : -1)];
    if (newZoomScale) {
      jumpToZoomScale(newZoomScale, positionX);
    }
  };

  useEffect(() => {
    generateDateMarks();
  }, [currentZoomScaleData, forceRenderDMs]);

  useEffect(() => {
    // if window.innerWidth changes, we need to update the renderBorders
    renderBorders.current = [-window.innerWidth * 2, window.innerWidth * 3];
  }, [window.innerWidth]);

  useEffect(() => {
    const handleResize = () => {
      setDateMarkInterval(window.innerWidth <= 768 ? pastBarSettings.pastBarMobileOffset : pastBarSettings.pastBarDesktopOffset);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pastBarSettings]);

  return (
    <PBContext.Provider
      value={{
        currentZoomScaleData,
        dateMarkInterval,
        dateMarkList,
        setCurrentZoomScaleData,
        pastBarCrd,
        setDateMarkList,
        setPastBarCrd,
        jumpToZoomScale,
        handleZoom,
        totalOffset,
        forceUpdateDMs,
        zoomOffset,
        closestDateMarkData,
        offsetDisplacement,
        forceRenderDMs,
        datejs
      }}
    >
      {children}
    </PBContext.Provider>
  );
};
