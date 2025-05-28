type TimeviewData = Record<string, string | number>[];

/**
 * Transforms Google Sheet data into timeview data format
 * @param gSheetData - Array of arrays containing the Google Sheet data
 * @returns Array of objects representing the timeview data
 */
export function sheet2Timeview(gSheetData: (string | number)[][]): TimeviewData {
  gSheetData.forEach((row) => {
    // transform strings into numbers, today into currentYear, colors into hex
    if (row[1] === 'date') {
      row.forEach((cell, index) => {
        if (typeof cell === 'string' && !isNaN(Number(cell))) {
          row[index] = Number(cell);
        } //transform in number if string
        if (cell === 'today') {
          row[index] = new Date().getFullYear();
        }
      });
    }
    if (row[1] === 'number') {
      row.forEach((cell, index) => {
        if (typeof cell === 'string' && !isNaN(Number(cell))) {
          row[index] = Number(cell);
        }
      });
    }
    if (row[1] === '%') {
      row.forEach((cell, index) => {
        if (index > 2) {
          if (typeof cell === 'string' && !isNaN(Number(cell))) {
            row[index] = Number(cell) + '%';
          }
        }
      });
    }
    if (row[1] === 'color') {
      row.forEach((cell, index) => {
        if (index > 2) {
          row[index] = '#' + row[index];
        }
      });
    }
  });
  gSheetData.shift(); // delete gSheetData[0]
  gSheetData.forEach((row) => {
    row.splice(0, 2);
  }); // delete 1st two entries in each row

  // transpose, make first row a header, json-ify gSheetData
  const transposedData = transposeArray(gSheetData);
  const headers = transposedData.shift() as string[];
  const transformedData = transposedData.map((row) => {
    const obj: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  return transformedData;
}

/**
 * Transposes a 2D array
 * @param array - The array to transpose
 * @returns The transposed array
 */
function transposeArray<T>(array: T[][]): T[][] {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
} 
