import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';

import { useLayersSettings } from '../useLayersSettings/useLayersSettings';
import { usePastBarData } from '../usePastBarDataV2/usePastBarData';
import { renderPositionByTimestamp, renderTimestampByPosition } from '../usePastBarDataV2/utils';

interface Props {
  handleZoom: (direction: 'in' | 'out', positionX: number) => void;
  application: PIXI.Application | undefined;
}

const processZoomCallback = (application: PIXI.Application, deltaX: number, animationDuration: number, totalOffset: React.MutableRefObject<number>) => {
  // console.log('processZoomCallback', deltaX);
  const newOffset = Number(gsap.getProperty(application.stage, 'x')) + deltaX;
  const tween = gsap.to(application.stage, {
    x: newOffset, duration: animationDuration / 1000, ease: 'none'
  });
  totalOffset.current = newOffset;
};

const setRatio = (relativeX: number, application: PIXI.Application, cursorRatio: React.MutableRefObject, closestDateMarkData: React.MutableRefObject) => {
  const dateMarks = application.stage.children.filter(c => c.type === 'dateMark');
  const closestDateMark = dateMarks.reduce((prev, curr) => {
    return Math.abs(curr.x - relativeX) < Math.abs(prev.x - relativeX) ? curr : prev;
  }, dateMarks[0]);
  closestDateMarkData.current = { name: closestDateMark.name, x: closestDateMark.x, cursorX: relativeX };
  cursorRatio.current = {
    relative: relativeX / application.stage.width,
    x: relativeX + application.stage.x,
  };
};

export const useScrollController = ({ handleZoom, application }: Props) => {
  const {
    closestDateMarkData,
    dateMarkList,
    dateMarkInterval,
    totalOffset,
    currentZoomScaleData,
  } = usePastBarData();
  const cursorRatio = useRef(null);
  const [scrollInProgress, setScrollInProgress] = useState(false);
  const scrollTimeout = useRef(null);

  const onScroll = (event) => {
    if (!scrollInProgress) {
      setScrollInProgress(true);
      const deltaY = event.deltaY;
      const relativeX = event.clientX - application.stage.x;
      // console.log('renderTimestampByPosition', formatText(renderTimestampByPosition(relativeX, currentZoomScaleData, closestDateMarkData.current, dateMarkInterval), currentZoomScaleData));
      // setRatio(relativeX, application, cursorRatio, closestDateMarkData);
      const intervalPx = currentZoomScaleData.intervalMultiplier ? currentZoomScaleData.intervalMultiplier * dateMarkInterval : dateMarkInterval;
      const zoomedTs = renderTimestampByPosition(relativeX, currentZoomScaleData, closestDateMarkData.current, intervalPx);
      closestDateMarkData.current = { name: String(zoomedTs), x: relativeX, cursorX: relativeX };
      if (deltaY > 0) {
        handleZoom('out', event.clientX);
      } else if (deltaY < 0) {
        handleZoom('in', event.clientX);
      }
    }

    // Reset the timeout each time the wheel event fires
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set a new timeout to detect scroll end
    scrollTimeout.current = setTimeout(() => {
      scrollEnd();
    }, 100);
  };

  const scrollEnd = () => {
    setScrollInProgress(false);
  };

  useEffect(() => {
    // find the closest dm for zooming using buttons
    if (!closestDateMarkData.current || !totalOffset.current) return;
    if ((closestDateMarkData.current.x + totalOffset.current) > window.innerWidth || (closestDateMarkData.current.x + totalOffset.current) < 0) {
      const relativeX = window.innerWidth / 2 - application.stage.x;
      setRatio(relativeX, application, cursorRatio, closestDateMarkData);
    }
  }, [dateMarkList]);

  return { onScroll };
};
