const fetchNTLParameters = async () => {
  const deploymentID =
    "AKfycbywCO0y749QSHN-MBimGejUWmN_bOF3EJpUYsbiS3irOoKSg4c9Rex6ONmZ1ssdHwiX5Q";

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/" + deploymentID + "/exec",
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch nTLParameters file`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching nTLParameters:", error);
    return {}; // Return an empty object on error
  }
};

export default fetchNTLParameters;
