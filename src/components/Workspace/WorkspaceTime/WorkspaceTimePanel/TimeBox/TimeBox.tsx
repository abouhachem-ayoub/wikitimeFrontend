import * as PIXI from 'pixi.js';

export const createTimeBox = (application: PIXI.Application, data: {
  x: number,
  width: number,
  startTs: number,
  endTs: number,
  timelineBottom: number,
  alpha: number,
  color: string,
  height: number,
}) => {
  const { x, width, timelineBottom, alpha, color, startTs, height } = data;
  const timeBox = new PIXI.Graphics();
  
  timeBox.x = x;
  timeBox.name = `tb_${startTs}`;
  timeBox.type = 'timeBox';
  
  const drawTimeBox = () => {
    timeBox.clear();
    timeBox.beginFill(color);
    timeBox.drawRect(
      0,
      timelineBottom,
      width,
      height,
    );
    timeBox.endFill();
  };

  drawTimeBox();
  
  timeBox.alpha = alpha;
  application.stage.addChild(timeBox);

  return timeBox;
};
