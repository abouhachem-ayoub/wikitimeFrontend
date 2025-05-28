type TimeviewData = string[][];

/**
 * Fetches timeview data from a Google Spreadsheet URL
 * @param gSheetUrl - The URL of the Google Spreadsheet to fetch data from
 * @returns Promise containing an array of arrays of strings representing the spreadsheet data
 * @throws Error if the fetch fails or if no table is found
 */
export async function fetchGSheetTimeviewData(gSheetUrl: string): Promise<TimeviewData> {
  try {
    const response = await fetch(gSheetUrl);
    if (!response.ok) {
      throw new Error(
        `Timeview Google Spreadsheet HTTP error! status: ${response.status}`,
      );
    }
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    // Extract table data
    const table = doc.querySelector('table');
    if (table) {
      // "rows" = array converted from the NodeList "table"
      const rows = Array.from(table.querySelectorAll('tr'));
      // "data" = array of arrays of strings, row by row
      const data = rows.map((row) => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        return cells.map((cell) => cell.textContent?.trim() || '');
      });
      return data;
    } else {
      console.error('Timeview Google Spreadsheet = Table not found');
      throw new Error('Timeview Google Spreadsheet = Table not found');
    }
  } catch (err) {
    console.error('Error fetching data from Google Sheets:', err);
    throw err;
  }
} 
