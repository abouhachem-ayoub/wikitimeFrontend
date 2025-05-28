// Third-party imports
// Local imports
import yearjs from 'modules/yearjs';
import dayjs from 'dayjs';
import * as PIXI from 'pixi.js';

interface DateMarkConfig {
  x: number;
  pastBarBottom: number;
  ts: number;
  tMStampHeight: number;
  tMStampWidth: number;
  tMTextFontSize: number;
  zoomScale: {
    id: number;
    date: {
      unit: string;
      format: string;
    };
  };
  tMStampVisible: boolean;
  tMDateVisible: boolean;
  alpha?: number;
  color?: number;
  width: number;
  backgroundHeight: number;
  backgroundColor?: string;
  optimize?: boolean;
}

interface DateMarkContainer extends PIXI.Container {
  type: string;
  startPoint: number;
}

export const drawBackground = (background: PIXI.Graphics, backgroundColor: string, containerWidth: number, pastBarHeight: number) => {
  background.clear();
  background.width = containerWidth;
  background.beginFill(backgroundColor);
  background.drawRect(0, 0, containerWidth, pastBarHeight);
  background.endFill();
};

export const createText = (ts: number, zoomScale: DateMarkConfig['zoomScale'], tMTextFontSize: number, containerCenterX: number, pastBarBottom: number, tMStampHeight: number, tMDateVisible: boolean) => {
  const dateText = new PIXI.Text(formatText(ts, zoomScale), {
    fontSize: tMTextFontSize,
    fill: 0xffffff, // Text color (white)
    align: 'center',
  });
  dateText.style.stroke = 0x000000;
  dateText.style.strokeThickness = 3;
  if (zoomScale.id > 26) {
    dateText.x = containerCenterX - dateText.width / 2;
  } else {
    dateText.anchor.set(0.5, 0);
    dateText.x = 0;
  }
  dateText.y = pastBarBottom + tMStampHeight + 2; // Small gap between square and text
  dateText.name = 'tMDate';
  dateText.alpha = 0;
  if (tMDateVisible) {
    dateText.alpha = 1;
  }
  return dateText;
}

export const createDateMark = (app: PIXI.Application, config: DateMarkConfig): DateMarkContainer => {
  const {
    ts,
    x,
    pastBarBottom,
    color = 0x000000,
    tMStampHeight,
    tMStampWidth,
    tMTextFontSize,
    zoomScale,
    tMStampVisible,
    tMDateVisible,
    alpha,
    width,
    backgroundHeight,
    backgroundColor,
    optimize = false,
  } = config;

  const containerWidth = width;
  const containerCenterX = containerWidth / 2;

  const dateMarkContainer = new PIXI.Container() as DateMarkContainer;
  dateMarkContainer.name = String(ts);
  dateMarkContainer.type = 'dateMark';
  dateMarkContainer.startPoint = x;
  dateMarkContainer.x = x;
  // dateMarkContainer.width = width;
  if (backgroundColor) {
    const background = new PIXI.Graphics();
    background.name = 'background';
    drawBackground(background, backgroundColor, containerWidth, backgroundHeight);
    dateMarkContainer.addChild(background as PIXI.DisplayObject);
  }

  // Create the square
  const square = new PIXI.Graphics();
  square.beginFill(color);
  square.drawRect(-tMStampWidth / 2, 0, tMStampWidth, tMStampHeight);
  square.endFill();
  square.y = pastBarBottom;
  square.alpha = 0;
  square.name = 'tMStamp';
  if (tMStampVisible) square.alpha = 1;
  if (!optimize || tMStampVisible) {
    dateMarkContainer.addChild(square as PIXI.DisplayObject);
  }
  // Create the text
  const dateText = createText(ts, zoomScale, tMTextFontSize, containerCenterX, pastBarBottom, tMStampHeight, tMDateVisible);

  if (!optimize || tMDateVisible) {
    dateMarkContainer.addChild(dateText as PIXI.DisplayObject);
  }

  if (alpha !== undefined) {
    dateMarkContainer.alpha = alpha;
  }

  // Add to the stage
  app.stage.addChild(dateMarkContainer as PIXI.DisplayObject);
  return dateMarkContainer;
};

export const formatText = (ts: number, zoomScale: DateMarkConfig['zoomScale']): string => {
  if (zoomScale.date.unit !== 'year') { return dayjs(ts).format(zoomScale.date.format); } else { return yearjs(ts).format(zoomScale.date.format); }
}; 
