export async function fetchTimeviewData(timeviewJson: any) {
  const response = await fetch(timeviewJson);

  if (!response.ok) {
    throw new Error(`Timeview JSON HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  // Return the data from the JSON file
  return data;
}
