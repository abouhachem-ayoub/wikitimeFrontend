export interface dateMarkType {
  x: number;
  timestamp: number;
  isTooClose?: boolean;
}

export interface TimeBoxType {
  x: number;
  width: number;
  startTs: number;
  endTs: number
}

export type TimePeriodType = Pick<TimeBoxType, 'startTs' | 'endTs'>

export interface SettingsLayerType {
  name: Layer;
  visible: boolean;
}

export enum Layer {
  tMStamp = 'tMStamp',
  tMDate = 'tMDate',
  pastBar = 'pastBar',
}
