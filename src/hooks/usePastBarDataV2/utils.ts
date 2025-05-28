import { Dayjs } from 'dayjs';

import { ZoomScale } from '../../config/zoomscale';
import { yearjs } from '../../modules';
import Yearjs from '../../modules/yearjs';
import { YearJs } from '../../modules/yearjs/yearjs';
import { dateMarkType } from '../../types/pastbar';

const CLOSE_LIMIT_PX = 50;

export const findDMByTimestamp = (timestamp: number, dateMarks: dateMarkType[], dateMarkIntervalPx: number, zoomScale: ZoomScale, closestDateMarkData: any): dateMarkType | undefined => {
  const searchDM = dateMarks.find((dateMark) => dateMark.timestamp === timestamp);
  if (!searchDM) {
    const finalX = renderPositionByTimestamp(yearjs(timestamp), zoomScale, closestDateMarkData, dateMarkIntervalPx);
    let isTooClose = dateMarks.some((dateMark) => {
      if (Math.abs(dateMark.x - finalX) < CLOSE_LIMIT_PX) {
        return true;
      }
    });
    // if (isTooClose) {
    //   return undefined;
    // }
    if (finalX) {
      if (dateMarks.find((dateMark) => parseInt(String(dateMark.x)) === parseInt(String(finalX)))) {
        isTooClose = true;
      }
      return {
        timestamp: timestamp,
        x: finalX,
        isTooClose,
      };
    }
  }
};

export const useFindDM = (dateMarkIntervalPx: number) => {
  return {
    findZeroDM: (dateMarks: dateMarkType[], currentZoomScale: ZoomScale, closestDateMarkData: any) => findDMByTimestamp(0, dateMarks, dateMarkIntervalPx, currentZoomScale, closestDateMarkData),
    findTodayDM: (dateMarks: dateMarkType[], currentZoomScale: ZoomScale, closestDateMarkData: any) => findDMByTimestamp(yearjs().valueOf(), dateMarks, dateMarkIntervalPx, currentZoomScale, closestDateMarkData),
    findBigBangDM: (dateMarks: dateMarkType[], currentZoomScale: ZoomScale, closestDateMarkData: any) => findDMByTimestamp(-13.8 * 1000 * 1000 * 1000, dateMarks, dateMarkIntervalPx, currentZoomScale, closestDateMarkData)
  };
};

export const calcEndTs = (currentZoomScaleData: ZoomScale, dateMarkCount: number) => {
  const countUnitsForEachElement = currentZoomScaleData.frequency * currentZoomScaleData.date.value;
  const middleDMTs = yearjs(0);
  const endDMTs = middleDMTs.add(countUnitsForEachElement * Math.floor(0.8 * 2 * dateMarkCount / 3));
  return endDMTs.valueOf();
};

export const ZERO_INDEX = 3;

// export const renderPositionByTimestamp = (timestamp: YearJs | Dayjs, zoomScale: ZoomScale, dateMarkInterval: number) => {
//   const tsInterval = zoomScale.frequency * zoomScale.date.value;
//   const zeroOffset = timestamp.valueOf() / tsInterval + ZERO_INDEX;
//   return zeroOffset * dateMarkInterval; // = x
// }
//
// export const renderTimestampByPosition = (x: number, zoomScale: ZoomScale, dateMarkInterval: number) => {
//   const tsInterval = zoomScale.frequency * zoomScale.date.value;
//   const zeroOffset = (x / dateMarkInterval) - ZERO_INDEX;
//   return zeroOffset * tsInterval;
// }

// export const renderPositionByTimestamp = (timestamp: YearJs | Dayjs, zoomScale: ZoomScale, totalOffset: number, dateMarkInterval: number) => {
//   const tsInterval = zoomScale.frequency * zoomScale.date.value;
//   const zeroOffset = timestamp.valueOf() / tsInterval + ZERO_INDEX;
//   return zeroOffset * dateMarkInterval; // = x
// }

export const renderPositionByTimestamp = (timestamp: YearJs | Dayjs, zoomScale: ZoomScale, zeroData: any, dateMarkInterval: number) => {
  const tsInterval = zoomScale.frequency * zoomScale.date.value;
  const zeroOffset = (timestamp.valueOf() - yearjs(zeroData.name).valueOf()) / tsInterval;
  return zeroData.x + zeroOffset * dateMarkInterval; // = x
};

export const renderTimestampByPosition = (x: number, zoomScale: ZoomScale, zeroData: any, dateMarkInterval: number) => {
  const tsInterval = zoomScale.frequency * zoomScale.date.value;
  const zeroOffset = (x - zeroData.x) / dateMarkInterval;
  return yearjs(zeroData.name).valueOf() + zeroOffset * tsInterval;
};
