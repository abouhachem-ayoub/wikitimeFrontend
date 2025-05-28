import { ContextTimePanel } from 'contexts/ContextTimePanel';
import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { useContext, useEffect, useRef } from 'react';

import { createTimeBox } from '../../components/Workspace/WorkspaceTime/WorkspaceTimePanel/TimeBox/TimeBox';
import { ZoomScale } from '../../config/zoomscale';
import { ContextTimeLine } from '../../contexts/ContextTimeLine';
import { yearjs } from '../../modules';
import { Layer, TimeBoxType } from '../../types/pastbar';
import { useLayersSettings } from '../useLayersSettings/useLayersSettings';
import { usePastBarData } from '../usePastBarDataV2/usePastBarData';
import { renderPositionByTimestamp } from '../usePastBarDataV2/utils';
import { useTimeBoxPosition } from '../useTimeBoxPosition/useTimeBoxPosition';
import { averageDistance, checkAnimHash, getAnimHash } from '../useTimeLineAnimations/utils';

export const useTimePanelAnimations = (application: PIXI.Application) => {
  const {
    pastBarHeight,
    pastBarColor,
  } = useContext(ContextTimeLine);

  const {
    timeBoxHeight,
  } = useContext(ContextTimePanel);

  const animationData = useRef<{
    timeBoxList: TimeBoxType[],
    newZoomScaleData: ZoomScale | undefined,
    prevZoomScaleData: ZoomScale | undefined,
    lastChangeTs: number | undefined,
  }>({
    timeBoxList: [],
    newZoomScaleData: undefined,
    prevZoomScaleData: undefined,
    lastChangeTs: undefined,
  });

  const {
    currentZoomScaleData,
    dateMarkList,
    dateMarkInterval,
    totalOffset,
    closestDateMarkData,
  } = usePastBarData();

  const { timeBoxList } = useTimeBoxPosition();

  const { animationDuration } = useLayersSettings();

  useEffect(() => {
    const animation = () => {
      try {
        if (!application || !application.stage || !animationData.current) return;
        animationData.current.timeBoxList.forEach((timeBox: TimeBoxType) => {
          const timeBoxGraphics = application.stage.getChildByName(`tb_${timeBox.startTs}`);
          // const timeBoxesGr = application?.stage?.children.filter((child) => child.name === 'timeBox').filter(child => child.zs === animationData.current.prevZoomScaleData.id);
          if (!timeBoxGraphics && timeBox.width > 0) {            
            // console.log("create timeBox", timeBox);
            // create timeBox
            const prevX = renderPositionByTimestamp(yearjs(timeBox.startTs), animationData.current.prevZoomScaleData!, closestDateMarkData.current, dateMarkInterval);
            const newDmGr = createTimeBox(application, {
              startTs: timeBox.startTs,
              endTs: timeBox.endTs,
              x: prevX,
              width: timeBox.width,
              timelineBottom: pastBarHeight * 2,
              alpha: 0.01,
              color: pastBarColor,
              height: timeBoxHeight,
            });
          }
        });

        application.stage.children.forEach((child) => {
          if (!child || !child.parent || !child.transform) return;
          // if (child.initial) return;
          if (child.type === 'timeBox') {
            if (child.alpha === 0) {
              child.destroy();
              gsap.killTweensOf(child);
              return;
            }
            const prev = JSON.stringify(animationData.current.timeBoxList);
            const timeBox = animationData.current.timeBoxList.find((tb) => `tb_${tb.startTs}` === child.name);
            if (timeBox) {
              // move timeBox
              // console.log("move timeBox", timeBox);
              const newX = timeBox.x;
              if (checkAnimHash(newX, child, animationData.current as any)) {
                if (gsap.isTweening(child)) {
                  gsap.killTweensOf(child);
                }
                const newTween = gsap.to(child, {
                  duration: animationDuration / 1000,
                  ease: 'none',
                  x: newX,
                  pixi: {
                    alpha: 1,
                    width: timeBox.width,
                  },
                  overwrite: true,
                });
                child.target = getAnimHash(newX, animationData.current as any);
                if (animationData.current.prevZoomScaleData!.id === animationData.current.newZoomScaleData!.id) {
                  child.startPoint = gsap.getProperty(child, 'x') as number;
                }
              }
            } else {
              // console.log("destroy timeBox", child);
              child.destroy();
              gsap.killTweensOf(child);
            }
          }
        }
        );
        if (animationData.current.prevZoomScaleData!.id !== animationData.current.newZoomScaleData!.id) {
          if (animationData.current.lastChangeTs! + animationDuration < Date.now()) {
          // animation finished
            animationData.current.prevZoomScaleData = animationData.current.newZoomScaleData;
          } 
        }
      } catch (e) {
        console.error('error in animation', e);
      }
    };

    application?.ticker?.add(animation);
    return () => {
      application?.ticker?.remove(animation);
    };
  }, [application]);

  useEffect(() => {
    // console.log('dateMarkList', dateMarkList, pastBarCrd)
    animationData.current = {
      ...animationData.current,
      timeBoxList,
    };
  }, [timeBoxList]);

  useEffect(() => {
    // console.log('currentZoomScaleData', animationData.current.prevZoomScaleData?.id, currentZoomScaleData.id)
    animationData.current = {
      ...animationData.current,
      prevZoomScaleData: !animationData.current.prevZoomScaleData ? animationData.current.newZoomScaleData : animationData.current.prevZoomScaleData,
      newZoomScaleData: currentZoomScaleData,
      lastChangeTs: Date.now(),
    };
  }, [currentZoomScaleData]);
};
