interface SpanFocusResult {
  start: number;
  end: number;
}

/**
 * Resizes a time span by adding margins
 * @param startYear - The start year of the span
 * @param endYear - The end year of the span
 * @returns Object containing the resized start and end years
 */
export function spanFocusResized(startYear: number, endYear: number): SpanFocusResult {
  const zoomMargin = 0.1; //AEFFsettings
  const timeRange = Math.floor(Math.abs(endYear - startYear) * zoomMargin);
  const start = startYear - timeRange;
  const end = endYear + timeRange;
  return { start, end };
}

/**
 * Converts a string to an ISO date
 * @param dateString - The string to convert
 * @returns The ISO date string or the original string if conversion fails
 */
export const string2date = (dateString: string): string => {
  if (dateString.startsWith('-') || dateString.startsWith('+')) {
    return dateString.replace(/^\+/, '').split('T')[0].split('-00')[0];
  }
  const yearMatch = dateString.match(/^(\d{4})^/);
  if (yearMatch) {
    return yearMatch ? yearMatch[1] : '';
  }
  try {
    return new Date(dateString).toISOString().split('T')[0].split('-00')[0];
  } catch {
    return dateString;
  }
}; 
