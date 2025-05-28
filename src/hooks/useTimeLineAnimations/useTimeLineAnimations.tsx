import { createDateMark, createText, drawBackground, formatText } from 'components/Workspace/WorkspaceTime/WorkspaceTimeLine/DateMark/DateMark';
import { createPastBar } from 'components/Workspace/WorkspaceTime/WorkspaceTimeLine/PastBar/PastBar';
import { ZoomScale } from 'config/zoomscale';
import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { MutableRefObject, useContext, useEffect, useRef } from 'react';

import { ContextTimeLine } from '../../contexts/ContextTimeLine';
import { yearjs } from '../../modules';
import { dateMarkType, Layer } from '../../types/pastbar';
import { useFps } from '../useFps';
import { useLayersSettings } from '../useLayersSettings/useLayersSettings';
import { usePastBarData } from '../usePastBarDataV2/usePastBarData';
import { renderPositionByTimestamp } from '../usePastBarDataV2/utils';
import { AnimationDataType, handleDateMarkAnimation, updatePixiDateMark } from './animationFunctions';
import { averageDistance, checkAnimHash, getAnimHash } from './utils';

// Constants
const HIGH_DETAIL_ZOOM_THRESHOLD = 26;
const DEFAULT_ALPHA = 0.01;
const DEFAULT_WIDTH = 0.01;

export const useTimeLineAnimations = (application: PIXI.Application) => {
  const {
    pastBarHeight,
    pastBarBottom,
    tMTextFontSize,
    tMStampHeight,
    tMStampWidth,
    pastBarColor,
  } = useContext(ContextTimeLine);

  const { updateFps } = useFps();

  const {
    currentZoomScaleData,
    dateMarkList,
    pastBarCrd,
    dateMarkInterval,
    closestDateMarkData,
  } = usePastBarData();

  const animationData = useRef<AnimationDataType>({
    dateMarkList: [],
    pastBarCrd: [undefined, undefined],
    newZoomScaleData: undefined,
    prevZoomScaleData: undefined,
    lastChangeTs: undefined,
  });

  const { getVisibility, visibilityConfig, animationDuration } = useLayersSettings();

  /**
   * Get text configuration for date mark
   */
  const getTextConfig = (timestamp: number) => {
    const newIntervalPx = getIntervalPx(animationData.current.newZoomScaleData, dateMarkInterval);
    const dateVisible = isDateVisible(timestamp, animationData.current.newZoomScaleData);
    
    return {
      tMTextFontSize,
      containerCenterX: newIntervalPx / 2,
      pastBarBottom,
      tMStampHeight,
      tMDateVisible: dateVisible && getVisibility(Layer.tMDate),
    };
  };

  /**
   * Helper to get interval pixels based on zoom scale
   */
  const getIntervalPx = (zoomScaleData: ZoomScale | undefined, interval: number): number => {
    if (!zoomScaleData?.intervalMultiplier) return interval;
    return zoomScaleData.intervalMultiplier * interval;
  };

  /**
   * Check if date should be visible at current zoom level
   */
  const isDateVisible = (timestamp: number, zoomScaleData: ZoomScale | undefined): boolean => {
    if (!zoomScaleData?.visible) return true;
    return zoomScaleData.visible(timestamp);
  };

  /**
   * Handle the creation of a new date mark
   */
  const handleCreateDateMark = (dateMark: dateMarkType, prevIntervalPx: number) => {
    const dateMarksGr = application?.stage?.children
      .filter((child) => child.type === 'dateMark')
      .filter(child => child.zs === animationData.current.prevZoomScaleData!.id);
    
    // Calculate position based on existing marks or fallback to calculation
    let prevX = renderPositionByTimestamp(
      yearjs(dateMark.timestamp), 
      animationData.current.prevZoomScaleData!, 
      closestDateMarkData.current, 
      prevIntervalPx
    );
    
    if (dateMarksGr.length) {
      // Find position based on average distance between existing marks
      const dmCoordinates = dateMarksGr.map((child) => child.x);
      const dmTimestamps = dateMarksGr.map((child) => Number(child.name));
      const dmDistance = averageDistance(dmCoordinates);
      const dmTimestampDistance = averageDistance(dmTimestamps);

      // Calculate coefficient for translating timestamp distance to x distance
      const coefficient = dmDistance / dmTimestampDistance;
      
      const dateMarkGr = dateMarksGr[0];
      const dateMarkGrTimestamp = Number(dateMarkGr.name);
      const timestampDistance = dateMark.timestamp - dateMarkGrTimestamp;
      const distance = coefficient * timestampDistance;
      
      if (dateMarkGr.x + distance) {
        prevX = dateMarkGr.x + distance;
      }
    }
    
    const dateVisible = isDateVisible(dateMark.timestamp, animationData.current.newZoomScaleData);
    const newColor = animationData.current.newZoomScaleData!.dmColor 
      ? animationData.current.newZoomScaleData!.dmColor(dateMark.timestamp) 
      : '#ffffff00';

    // Create the new date mark with appropriate visibility settings
    const newDmGr = createDateMark(application, {
      ts: dateMark.timestamp,
      x: prevX,
      pastBarBottom,
      tMStampHeight,
      tMStampWidth,
      tMTextFontSize,
      zoomScale: animationData.current.prevZoomScaleData!,
      tMStampVisible: animationData.current.newZoomScaleData!.id < HIGH_DETAIL_ZOOM_THRESHOLD && getVisibility(Layer.tMStamp),
      tMDateVisible: dateVisible && getVisibility(Layer.tMDate),
      alpha: DEFAULT_ALPHA,
      width: DEFAULT_WIDTH,
      backgroundHeight: pastBarHeight,
      backgroundColor: newColor,
      optimize: animationData.current.dateMarkList.length > 400,
    });
    
    newDmGr.zs = animationData.current.newZoomScaleData!.id;
    
    // Reset background widths for detailed zoom levels
    if (animationData.current.prevZoomScaleData!.id <= HIGH_DETAIL_ZOOM_THRESHOLD) {
      application.stage.children.forEach((child) => {
        child.children?.forEach((childElement) => {
          if (childElement.name === 'background' && 'width' in childElement) {
            (childElement as PIXI.Graphics).width = 0;
          }
        });
      });
    }
  };

  /**
   * Handle pastBar animation
   */
  const handlePastBarAnimation = (child: PIXI.DisplayObject) => {
    if (!animationData.current.pastBarCrd[0] || !animationData.current.pastBarCrd[1]) return;
      
    const newWidth = animationData.current.pastBarCrd[1] - animationData.current.pastBarCrd[0];
    const newX = animationData.current.pastBarCrd[0];
    
    if (checkAnimHash(newX, child, animationData.current as any)) {
      if (gsap.isTweening(child)) {
        gsap.killTweensOf(child);
      }
      
      gsap.to(child, {
        duration: animationDuration / 1000,
        ease: 'none',
        x: newX,
        pixi: {
          alpha: 1,
          width: newWidth,
        },
      });
      
      child.target = getAnimHash(newX, animationData.current as any);
    }
  };

  /**
   * Handle animation for existing date marks
   */
  const handleExistingDateMarkAnimation = (
    child: PIXI.DisplayObject,
    dateMark: dateMarkType,
    newIntervalPx: number,
    prevIntervalPx: number
  ) => {
    const newX = dateMark.x;
    
    if (!checkAnimHash(newX, child, animationData.current as any)) return;
    
    if (gsap.isTweening(child)) {
      gsap.killTweensOf(child);
    }
    
    const prevWidth = (child.children?.find((c) => c.name === 'background') as PIXI.Graphics)?.width || 0;
    
    gsap.to(child, {
      duration: animationDuration / 1000,
      ease: 'none',
      x: newX,
      pixi: {
        alpha: 1,
      },
      overwrite: true,
      onComplete: () => {
        const background = child.children?.find((c) => c.name === 'background');
        const newColor = animationData.current.newZoomScaleData!.dmColor 
          ? animationData.current.newZoomScaleData!.dmColor(dateMark.timestamp) 
          : '#ffffff00';
          
        drawBackground(background as PIXI.Graphics, newColor, newIntervalPx, pastBarHeight);
        updatePixiDateMark(child as PIXI.Container, newIntervalPx, pastBarHeight, animationData, getVisibility);
      },
      onUpdate: function () {
        const progress = this.progress();
        const zoomThresholdExceeded = 
          animationData.current.prevZoomScaleData!.id > HIGH_DETAIL_ZOOM_THRESHOLD || 
          animationData.current.newZoomScaleData!.id > HIGH_DETAIL_ZOOM_THRESHOLD;
          
        if (!zoomThresholdExceeded) return;
        
        const updateConfig = {
          updateBackground: true,
          updateTextAlpha: true,
          updateTextPosition: true,
        };
        
        // Skip text position update if we're already at target
        if (parseFloat(child.x.toString()).toFixed(5) === parseFloat(newX.toString()).toFixed(5)) {
          updateConfig.updateTextPosition = false;
        }
        
        // Skip text alpha update if zoom scale hasn't changed
        if (animationData.current.prevZoomScaleData!.id === animationData.current.newZoomScaleData!.id) {
          updateConfig.updateTextAlpha = false;
        }
        
        handleDateMarkAnimation(
          child as PIXI.Container,
          dateMark.timestamp,
          progress,
          animationData,
          newIntervalPx,
          prevWidth,
          pastBarHeight,
          true,
          dateMarkInterval,
          getTextConfig(dateMark.timestamp),
          updateConfig.updateBackground,
          updateConfig.updateTextAlpha,
          updateConfig.updateTextPosition,
        );
      }
    });
    
    child.target = getAnimHash(newX, animationData.current as any);
    
    if (animationData.current.prevZoomScaleData!.id === animationData.current.newZoomScaleData!.id) {
      child.startPoint = gsap.getProperty(child, 'x') as number;
      child.zs = animationData.current.prevZoomScaleData!.id;
    }
  };

  /**
   * Handle fade out animation for removed date marks
   */
  const handleRemovedDateMarkAnimation = (
    child: PIXI.DisplayObject,
    newIntervalPx: number,
    prevIntervalPx: number
  ) => {
    if (!child.name) return;
    
    const newX = renderPositionByTimestamp(
      yearjs(child.name),
      animationData.current.newZoomScaleData!,
      closestDateMarkData.current,
      dateMarkInterval
    );
    
    if (!checkAnimHash(newX, child, animationData.current as any) || child.alpha === 0) return;
    
    if (gsap.isTweening(child)) {
      gsap.killTweensOf(child);
    }
    
    if (!child || !child.parent) return;
    
    gsap.to(child, {
      duration: animationDuration / 1000,
      ease: 'none',
      x: newX,
      overwrite: true,
      pixi: {
        alpha: 0
      },
      onUpdate: function () {
        const progress = this.progress();
        const zoomThresholdExceeded = 
          animationData.current.prevZoomScaleData!.id > HIGH_DETAIL_ZOOM_THRESHOLD || 
          animationData.current.newZoomScaleData!.id > HIGH_DETAIL_ZOOM_THRESHOLD;
          
        if (!zoomThresholdExceeded) return;
        
        handleDateMarkAnimation(
          child as PIXI.Container,
          Number(child.name),
          progress,
          animationData,
          newIntervalPx,
          prevIntervalPx,
          pastBarHeight,
          false,
          dateMarkInterval,
          getTextConfig(Number(child.name)),
          true, false, false,
        );
      },
      onComplete: () => {
        if (child.parent) {
          child.alpha = 0;
          gsap.killTweensOf(child);
          child.parent.removeChild(child);
          child.destroy();
        }
      },
    });
    
    child.target = getAnimHash(newX, animationData.current as any);
  };

  /**
   * Main animation function that runs on each ticker frame
   */
  const runAnimation = () => {
    if (!application?.stage) return;
    
    updateFps();
    
    try {
      const newIntervalPx = getIntervalPx(animationData.current.newZoomScaleData, dateMarkInterval);
      const prevIntervalPx = getIntervalPx(animationData.current.prevZoomScaleData, dateMarkInterval);
      
      // Create past bar if needed
      const pastBarGraphics = application.stage.getChildByName('pastBar');
      if (!pastBarGraphics && getVisibility(Layer.pastBar)) {
        createPastBar(application, {
          pastBarBottom,
          pastBarColor,
          pastBarCrd,
        });
      }
      
      // Create missing date marks
      animationData.current.dateMarkList.forEach((dateMark) => {
        const dateMarkGraphics = application.stage.getChildByName(String(dateMark.timestamp));
        if (!dateMarkGraphics) {
          handleCreateDateMark(dateMark, prevIntervalPx);
        }
      });
      
      // Process animations for all children
      application.stage.children.forEach((child) => {
        if (!child || !child.parent || !child.transform) return;
        
        // Remove faded out elements
        if (child.alpha === 0 && ['dateMark', 'pastBar'].includes(child.type!)) {
          child.destroy();
          gsap.killTweensOf(child);
          return;
        }
        
        // Handle past bar animation
        if (child.type === 'pastBar') {
          handlePastBarAnimation(child);
        } else if (child.type === 'dateMark') {
          const dateMark = animationData.current.dateMarkList.find(
            (dm) => String(dm.timestamp) === child.name
          );
          
          if (dateMark) {
            // Animate existing date mark
            handleExistingDateMarkAnimation(child, dateMark, newIntervalPx, prevIntervalPx);
          } else {
            // Fade out removed date mark
            handleRemovedDateMarkAnimation(child, newIntervalPx, prevIntervalPx);
          }
        }
      });
      
      // Update zoom scale after animation completes
      if (animationData.current.prevZoomScaleData!.id !== animationData.current.newZoomScaleData!.id) {
        if (animationData.current.lastChangeTs! + animationDuration < Date.now()) {
          // Animation finished
          animationData.current.prevZoomScaleData = animationData.current.newZoomScaleData;
        } 
      }
    } catch (e) {
      console.error('Error in animation:', e);
    }
  };

  // Add animation to PIXI ticker
  useEffect(() => {
    application?.ticker?.add(runAnimation);
    return () => {
      application?.ticker?.remove(runAnimation);
    };
  }, [application, visibilityConfig]);

  // Clear stage when visibility config changes
  useEffect(() => {
    if (application?.stage?.children) {
      application.stage.children.forEach((child) => {
        application.stage.removeChild(child);
        child.destroy();
      }); 
    }
  }, [visibilityConfig]);

  // Update dateMarkList and pastBarCrd in animation data
  useEffect(() => {
    animationData.current = {
      ...animationData.current,
      dateMarkList,
      pastBarCrd,
    };
  }, [dateMarkList, pastBarCrd]);

  // Update zoom scale data in animation data
  useEffect(() => {
    animationData.current = {
      ...animationData.current,
      prevZoomScaleData: !animationData.current.prevZoomScaleData 
        ? animationData.current.newZoomScaleData 
        : animationData.current.prevZoomScaleData,
      newZoomScaleData: currentZoomScaleData,
      lastChangeTs: Date.now(),
    };
  }, [currentZoomScaleData]);
};
