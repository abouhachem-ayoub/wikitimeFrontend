import * as PIXI from 'pixi.js';

interface PBConfig {
  pastBarBottom: number;
  pastBarColor: number;
  pastBarCrd: [number | undefined, number | undefined];
}

export const createPastBar = (app: PIXI.Application, config: PBConfig) => {
  // console.log("createPastBar called with config:", config); // Debugging
  const { pastBarBottom, pastBarColor, pastBarCrd } = config;
  const pastBar = new PIXI.Graphics();
  const start = pastBarCrd[0]!;
  const end = pastBarCrd[1]!;
  const width = end - start;
  pastBar.x = start;

  pastBar.startWidth = width;
  pastBar.startPoint = start;
  pastBar.name = 'pastBar';
  pastBar.type = 'pastBar';

  const drawPastBar = () => {
    pastBar.clear();
    pastBar.beginFill(pastBarColor);
    pastBar.drawRect(
      0,
      0, // app.view.height - pastBarBottom,
      width,
      pastBarBottom,
    );
    pastBar.endFill();
  };

  drawPastBar(); // Initial draw
  app.stage.addChild(pastBar);

  return pastBar;
};
