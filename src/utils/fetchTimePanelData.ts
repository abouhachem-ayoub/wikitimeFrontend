// Third-party imports
import dayjs from 'dayjs';

// Constants
const today = dayjs().format('YYYY-MM-DD'); // today's date in the format yyyy-MM-dd using dayjs
const currentYear = dayjs().year();
const currentMonth = dayjs().month() + 1; // dayjs months are 0-indexed
const currentDay = dayjs().date();
const history = -3500;
const commonEra = 0;

interface TimePanelItem {
  startYear: number | string;
  endYear: number | string;
  startMonth?: number;
  endMonth?: number;
  startDay?: number;
  endDay?: number;
  startDate?: string;
  endDate?: string;
  color?: string;
}

/**
 * Fetches and transforms time panel data from a JSON file
 * @param url - The URL of the JSON file to fetch
 * @returns Promise containing an array of transformed time panel items
 */
export const handleFetchTimePanelData = async (url: string): Promise<TimePanelItem[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const transformedData = transformTimePanelData(data);

    return transformedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

/**
 * Transforms time panel data by converting date fields to integers and ISO 8601 format
 * @param data - Array of time panel items to transform
 * @returns Array of transformed time panel items
 */
export const transformTimePanelData = (data: TimePanelItem[]): TimePanelItem[] => {
  // Convert date fields to integers and ISO 8601 format
  data.forEach((item) => {
    // transform "today" into current year/month/day
    if (item.startYear === 'today') {
      item.startYear = currentYear;
      item.startMonth = currentMonth;
      item.startDay = currentDay;
    }
    if (item.endYear === 'today') {
      item.endYear = currentYear;
      item.endMonth = currentMonth;
      item.endDay = currentDay;
    }

    // Ensure years are integers (not strings)
    item.startYear = Number(item.startYear);
    item.endYear = Number(item.endYear);

    // add month/day if not present, make sure they're integers otherwise (not strings)
    if (!item.startMonth) {
      item.startMonth = 1;
      item.startDay = 1;
    } else {
      item.startMonth = Number(item.startMonth);
      item.startDay = Number(item.startDay);
    }
    if (!item.endMonth) {
      item.endMonth = 12;
      item.endDay = 31;
    } else {
      item.endMonth = Number(item.endMonth);
      item.endDay = Number(item.endDay);
    }

    // create item.dates in ISO 8601 format
    item.startDate = dayjs()
      .year(item.startYear)
      .month(item.startMonth - 1)
      .date(item.startDay)
      .format('YYYY-MM-DD');
    item.endDate = dayjs()
      .year(item.endYear)
      .month(item.endMonth - 1)
      .date(item.endDay)
      .format('YYYY-MM-DD');

    const getRandomLuminanceColor = (): string => {
      //random colors with luminance between 150 and 200
      const getRandomValue = () => Math.floor(Math.random() * 51) + 150;
      const r = getRandomValue();
      const g = getRandomValue();
      const b = getRandomValue();
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };
    item.color = getRandomLuminanceColor();
  });

  // at some point I will put here a field for the parent-child relationship logic
  return data;
}; 
