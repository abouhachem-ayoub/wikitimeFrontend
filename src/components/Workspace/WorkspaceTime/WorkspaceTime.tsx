import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import { ICanvas } from 'pixi.js';
import { Application } from 'pixi.js';
import { useContext, useEffect, useRef, useState } from 'react';
import React from 'react';

import { ContextTimeLine } from '../../../contexts/ContextTimeLine';
import { ContextTimePanel } from '../../../contexts/ContextTimePanel';
import { useLayersSettings, usePastBarData } from '../../../hooks';
import { useScrollController } from '../../../hooks/useScrollController/useScrollController';
import { useSwipe } from '../../../hooks/useSwipe/useSwipe';
import PixiSettings from './PixiSettings/PixiSettings';
import WorkspaceTimeLine from './WorkspaceTimeLine/WorkspaceTimeLine';
import WorkspaceTimePanel from './WorkspaceTimePanel/WorkspaceTimePanel';

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

const WorkspaceTime = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application<ICanvas> | null>(null);
  const [application, setApplication] = useState<Application<ICanvas> | null>(null);
  const {
    pastBarHeight,
    pastBarBottom,
    pastBarColor,
  } = useContext(ContextTimeLine);
  const {
    timePanelHeight,
  } = useContext(ContextTimePanel);
  const { pastBarSettings, visibilityConfig } =
    useLayersSettings();

  const {
    handleZoom,
    totalOffset,
    forceUpdateDMs,
  } = usePastBarData();

  const throttleForceUpdateDMs = _.throttle(forceUpdateDMs, 1000);

  const handleSwipeFinish = (value: number) => {
    totalOffset.current = value;
    throttleForceUpdateDMs();
  };

  const { onScroll } = useScrollController({ handleZoom, application: application as Application<ICanvas> });

  useEffect(() => {
    const appWidth = canvasRef.current?.clientWidth;
    if (!appWidth || !canvasRef.current) return;
    const app = new PIXI.Application({
      width: appWidth,
      height: pastBarHeight * 2 + timePanelHeight,
      resolution: window.devicePixelRatio,
      antialias: false,
      autoDensity: true,
      backgroundAlpha: 0,
    });

    (canvasRef.current as any).appendChild(app.view);
    appRef.current = app;

    setApplication(app);

    return () => {
      app.destroy(true, { children: true });
    };
  }, [
    pastBarHeight,
    pastBarBottom,
    pastBarColor,
    visibilityConfig,
    pastBarSettings,
  ]);

  useSwipe(application as Application<ICanvas>, handleSwipeFinish);

  return (
    <div>
      <PixiSettings />
      <WorkspaceTimeLine application={application as Application<ICanvas>} />
      <WorkspaceTimePanel application={application as Application<ICanvas>} />
      <div ref={canvasRef} onWheel={onScroll}/>
    </div>
  );
};

export default WorkspaceTime;
