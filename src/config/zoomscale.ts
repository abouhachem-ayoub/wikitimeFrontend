import dayjs from 'dayjs';

import yearjs from 'modules/yearjs';

export interface ZoomScale {
  id: number;
  date: {
    value: number;
    unit: 'day' | 'month' | 'year';
    format: string;
    endTs?: number;
  }
  frequency: number;
  intervalMultiplier?: number;
  visible?: (ts: number) => boolean;
  dmColor?: (ts: number) => string;
}

export const MinMaxDates = {
  min: - 13.8 * 1000 * 1000 * 1000,
  max: dayjs().year()
};

export const initialZoomScale: ZoomScale = {
  id: -1,
  frequency: 1,
  date: {
    endTs: 110 * 1000 * 1000 * 1000,
    value: 10 * 1000 * 1000 * 1000,
    unit: 'year',
    format: 'K',
  }
};

export const ZoomScaleList: ZoomScale[] = [
  {
    id: 0,
    date: {
      endTs: 110 * 1000 * 1000 * 1000,
      value: 10 * 1000 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 1
  },
  {
    id: 1,
    date: {
      endTs: 80 * 1000 * 1000 * 1000,
      value: 1000 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 5
  },
  {
    id: 2,
    date: {
      endTs: 20 * 1000 * 1000 * 1000,
      value: 1000 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 2
  },
  {
    id: 3,
    date: {
      endTs: 10 * 1000 * 1000 * 1000,
      value: 1000 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 1
  },
  {
    id: 4,
    date: {
      endTs: 100 * 1000 * 1000,
      value: 100 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 5
  },
  {
    id: 5,
    date: {
      endTs: 50 * 1000 * 1000,
      value: 100 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 2
  },
  {
    id: 6,
    date: {
      endTs: 10 * 1000 * 1000,
      value: 100 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 1
  },
  {
    id: 7,
    date: {
      endTs: 10 * 1000 * 1000,
      value: 10 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 5
  },
  {
    id: 8,
    date: {
      endTs: 5 * 1000 * 1000,
      value: 10 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 2
  },
  {
    id: 9,
    date: {
      endTs: 1000 * 1000,
      value: 10 * 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 1
  },
  {
    id: 10,
    date: {
      endTs: 1000 * 1000,
      value: 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 5
  },
  {
    id: 11,
    date: {
      endTs: 500 * 1000,
      value: 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 2
  },
  {
    id: 12,
    date: {
      endTs: 100 * 1000,
      value: 1000 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 1
  },
  {
    id: 13,
    date: {
      endTs: 100 * 1000,
      value: 100 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 5
  },
  {
    id: 14,
    date: {
      endTs: 50 * 1000,
      value: 100 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 2
  },
  {
    id: 15,
    date: {
      endTs: 10 * 1000,
      value: 100 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 1
  },
  {
    id: 16,
    date: {
      endTs: 10 * 1000,
      value: 10 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 5
  },
  {
    id: 17,
    date: {
      endTs: 5 * 1000,
      value: 10 * 1000,
      unit: 'year',
      format: 'K',
    },
    frequency: 2
  }, {
    id: 18,
    date: {
      endTs: 1000,
      value: 10 * 1000,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 1
  },
  {
    id: 19,
    date: {
      endTs: 1000,
      value: 1000,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 5
  },
  {
    id: 20,
    date: {
      endTs: 2100,
      value: 1000,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 2
  },
  {
    id: 21,
    date: {
      endTs: 2100,
      value: 1000,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 1
  },
  {
    id: 22,
    date: {
      endTs: 2100,
      value: 100,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 5
  },
  {
    id: 23,
    date: {
      endTs: 2030,
      value: 100,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 2
  },
  {
    id: 24,
    date: {
      endTs: 2030,
      value: 100,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 1
  },
  {
    id: 25,
    date: {
      endTs: 2030,
      value: 10,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 5
  },
  {
    id: 26,
    date: {
      endTs: 2030,
      value: 10,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 2,
    // visible: (ts: number) => {
    //   return yearjs(ts).valueOf() % 20 === 0;
    // },
  },
  {
    id: 27,
    date: {
      endTs: 2030,
      value: 1,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 1,
    intervalMultiplier: 1 / 10,
    visible: (ts: number) => {
      return yearjs(ts).valueOf() % 10 === 0;
    },
    dmColor: (ts: number) => {
      return yearjs(ts).valueOf() % 2 === 0 ? '#80808080' : '#c4c4c480';
    }
  },
  {
    id: 28,
    date: {
      endTs: 2030,
      value: 1,
      unit: 'year',
      format: 'YYYY',
    },
    intervalMultiplier: 1 / 5,
    frequency: 1,
    visible: (ts: number) => {
      return yearjs(ts).valueOf() % 5 === 0;
    },
    dmColor: (ts: number) => {
      return yearjs(ts).valueOf() % 2 === 0 ? '#80808080' : '#c4c4c480';
    }
  },
  {
    id: 29,
    date: {
      endTs: 2030,
      value: 1,
      unit: 'year',
      format: 'YYYY',
    },
    frequency: 1,
    intervalMultiplier: 1 / 2,
    visible: (ts: number) => {
      return yearjs(ts).valueOf() % 2 === 0;
    },
    dmColor: (ts: number) => {
      return yearjs(ts).valueOf() % 2 === 0 ? '#80808080' : '#c4c4c480';
    }
  }
];
