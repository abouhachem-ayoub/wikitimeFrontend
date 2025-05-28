import { createText, drawBackground } from 'components/Workspace/WorkspaceTime/WorkspaceTimeLine/DateMark/DateMark';
import { ZoomScale } from 'config/zoomscale';
import * as PIXI from 'pixi.js';
import { MutableRefObject } from 'react';

import { dateMarkType, Layer } from '../../types/pastbar';

export interface AnimationDataType {
    dateMarkList: dateMarkType[];
    pastBarCrd: [number | undefined, number | undefined];
    newZoomScaleData: ZoomScale | undefined;
    prevZoomScaleData: ZoomScale | undefined;
    lastChangeTs: number | undefined;
  }
  
export const updatePixiDateMark = (child: PIXI.Container, dateMarkInterval: number, pastBarHeight: number, animationData: MutableRefObject<AnimationDataType>, getVisibility: (layer: Layer) => boolean) => {
  const dateMark = animationData.current.dateMarkList.find((dm) => String(dm.timestamp) === child.name);
  if (!dateMark) return;
  const tMStamp = child.children?.find((child) => child.name === 'tMStamp');
  const newVisible = animationData.current.newZoomScaleData!.id < 27 && getVisibility(Layer.tMStamp);
  if (tMStamp && Number(newVisible) !== tMStamp.alpha) {
    tMStamp.alpha = newVisible ? 1 : 0;
  }
};
  
export const handleDateTextAnimation = (
  tmDateGr: PIXI.Text,
  timestamp: number,
  progress: number,
  animationData: MutableRefObject<AnimationDataType>,
  width: number,
  isIncreasing: boolean,
  dateMarkInterval: number,
  dateVisible: boolean,
  updateTextAlpha: boolean = true,
  updateTextPosition: boolean = true,
) => {
  if (updateTextAlpha && Number(dateVisible) !== tmDateGr.alpha) {
    if (dateVisible) {
      const targetAlpha = 1;
      const prevAlpha = 0;
      const currentAlpha = tmDateGr.alpha;
      const newAlpha = currentAlpha + (targetAlpha - prevAlpha) * progress;
      tmDateGr.alpha = newAlpha;
    } else if (tmDateGr.alpha !== 0) {
      const targetAlpha = 0;
      const prevAlpha = 1;
      const currentAlpha = tmDateGr.alpha;
      const newAlpha = Math.max(0, Math.min(1, currentAlpha + (targetAlpha - prevAlpha) * progress));
      tmDateGr.alpha = newAlpha;
    }
  }
  
  if (updateTextPosition) {
    const targetAnchorX = animationData.current.newZoomScaleData?.id! <= 26 ? 0.5 : 0;
    const currentAnchorX = tmDateGr.anchor.x;
    const newAnchorX = currentAnchorX + (targetAnchorX - currentAnchorX) * progress;
    tmDateGr.anchor.set(newAnchorX, 0);
  
    const leftAlignedX = 0;
    const centeredCurrentX = width / 2 - tmDateGr.width / 2;
    const targetX = (animationData.current.newZoomScaleData?.intervalMultiplier! * dateMarkInterval) / 2 - tmDateGr.width / 2;
    tmDateGr.x = targetAnchorX === 0.5 ? leftAlignedX : centeredCurrentX + (targetX - centeredCurrentX) * progress;
  }
};
  
export const handleDateMarkAnimation = (
  child: PIXI.Container,
  timestamp: number,
  progress: number,
  animationData: MutableRefObject<AnimationDataType>,
  newBackgroundWidth: number,
  prevBackgroundWidth: number,
  pastBarHeight: number,
  isIncreasing: boolean,
  dateMarkInterval: number,
  textConfig: {
      tMTextFontSize: number,
      containerCenterX: number,
      pastBarBottom: number,
      tMStampHeight: number,
      tMDateVisible: boolean,
    },
  updateBackground: boolean = true,
  updateTextAlpha: boolean = true,
  updateTextPosition: boolean = true,
) => {
  const backgroundGr = child.children?.find((child) => child.name === 'background');
  let tmDateGr: PIXI.Text = child.children?.find((child) => child.name === 'tMDate') as PIXI.Text;
  
  const colorSource = isIncreasing ? animationData.current.newZoomScaleData! : animationData.current.prevZoomScaleData!;
  const newColor = colorSource.dmColor ? colorSource.dmColor(timestamp) : '#ffffff00';
  const width = isIncreasing ? prevBackgroundWidth + (newBackgroundWidth - prevBackgroundWidth) * Number(progress) : newBackgroundWidth - (newBackgroundWidth - prevBackgroundWidth) * Number(progress);
  
  if (updateBackground && backgroundGr) {
    drawBackground(backgroundGr as PIXI.Graphics, newColor, width, pastBarHeight);
  }
    
  const dateVisible = animationData.current.newZoomScaleData!.visible ?
    animationData.current.newZoomScaleData!.visible(timestamp) :
    timestamp % (animationData.current.newZoomScaleData!.frequency * animationData.current.newZoomScaleData!.date.value) === 0;
  
  if (updateTextPosition && !tmDateGr) {
    if (dateVisible) {
      tmDateGr = createText(timestamp, animationData.current.newZoomScaleData!, textConfig.tMTextFontSize, textConfig.containerCenterX, textConfig.pastBarBottom, textConfig.tMStampHeight, textConfig.tMDateVisible);
      child.addChild(tmDateGr as PIXI.DisplayObject);
    }
  }
  
  if (tmDateGr) {
    handleDateTextAnimation(tmDateGr, timestamp, progress, animationData, width, isIncreasing, dateMarkInterval, dateVisible, updateTextAlpha, updateTextPosition);
  }
};
