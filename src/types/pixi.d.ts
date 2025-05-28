import * as PIXI from 'pixi.js';

declare module 'pixi.js' {
  interface DisplayObject {
    type?: string;
    startPoint?: number;
    target?: string | number;
    zs?: number;
    startWidth?: number;
  }

  interface Graphics {
    type?: string;
    startPoint?: number;
    target?: string | number;
    zs?: number;
    startWidth?: number;
  }

  interface FederatedEventTarget {
    name?: string;
    alpha?: number;
  }
}
