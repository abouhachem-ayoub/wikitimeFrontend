import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { useEffect, useRef } from 'react';

import { usePastBarData } from '../usePastBarDataV2/usePastBarData';
import { ZERO_INDEX } from '../usePastBarDataV2/utils';

export const useSwipe = (application: PIXI.Application, setTotalOffset?: (value: number) => void) => {
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const { offsetDisplacement, dateMarkInterval, pastBarCrd, totalOffset } = usePastBarData();

  useEffect(() => {
    // console.log('offsetDisplacement', offsetDisplacement.current)
    if (!offsetDisplacement.current) return;
    if (offsetDisplacement.current <= 0) {
      gsap.to(application.stage, { x: dateMarkInterval * ZERO_INDEX, duration: 0.01, ease: 'power2.out' });
    }
  }, [offsetDisplacement.current]);

  useEffect(() => {
    if (!application || !application.stage) return;

    const stage = application.stage;

    const onPointerDown = (event) => {
      isDragging.current = true;
      lastMouseX.current = event.data.global.x;
      if (stage) { gsap.killTweensOf(stage); }
    };

    const onPointerMove = (event) => {
      if (!isDragging.current) return;
      // console.log('totalOffsetX', gsap.getProperty(stage, 'x'));
      const deltaX = event.data.global.x - lastMouseX.current;
      lastMouseX.current = event.data.global.x;
      setTotalOffset?.(Number(gsap.getProperty(stage, 'x')) + deltaX);
      gsap.to(stage, { x: stage.x + deltaX, duration: 0.01, ease: 'power2.out' });
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    stage.interactive = true;
    stage.on('pointerdown', onPointerDown);
    stage.on('pointermove', onPointerMove);
    stage.on('pointerup', onPointerUp);
    stage.on('pointerupoutside', onPointerUp);

    return () => {
      stage.off('pointerdown', onPointerDown);
      stage.off('pointermove', onPointerMove);
      stage.off('pointerup', onPointerUp);
      stage.off('pointerupoutside', onPointerUp);
    };
  }, [application]);

  useEffect(() => {
    // console.log('totalOffset.current', totalOffset.current)
    if (application?.stage) {
      application.stage.hitArea = new PIXI.Rectangle(pastBarCrd[0] - application.renderer.width, 0, pastBarCrd[1] - pastBarCrd[0] + application.renderer.width * 2, application.renderer.height);
    }
  }, [totalOffset.current, pastBarCrd]);
};
