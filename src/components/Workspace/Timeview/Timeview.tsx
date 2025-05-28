// Third-party imports
import { useContext, useEffect, useState } from 'react';

// Local imports
import timeview1Json from '../../../assets/timeviews/timeview1.json';
import timeview2Json from '../../../assets/timeviews/timeview2.json';
import { ContextApp } from '../../../contexts/ContextApp';
import { fetchGSheetTimeviewData } from '../../../utils/fetchGSheetTimeviewData';
import { sheet2Timeview } from '../../../utils/sheet2Timeview';
import Timeview1Buttons from './Timeview1Buttons';
import Timeview2Buttons from './Timeview2Buttons';

interface TimeviewData {
  startYear: number;
  endYear: number;
  bgColor: string;
  textColor: string;
  width: string;
  caption: string;
}

const Timeview: React.FC = () => {
  const {
    timeview1Data,
    setTimeview1Data,
    timeview2Data,
    setTimeview2Data,
    fetchTimeviewFromGsheet,
  } = useContext(ContextApp);

  if (fetchTimeviewFromGsheet) {
    const TV = [
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7HuiOsZgUw8fSVHvJh3KHf7f2j0kTCVd-P5mfWhHrRKbHAiW7wCmCChHSG3FhWJkf1PGIEeQc97Ux/pubhtml',
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLm15eHoZ5f-6Iiyo_RovOwBkf_WENgKb1K9Z4MBEvuNsYQh3jVCw9uKUhBmM9CYboMKs5PgKtm0pB/pubhtml',
    ];

    // fetch data from gSheet into array gSheetTimeview1Data
    const [timeview1Loading, setTimeview1Loading] = useState<boolean>(true);
    const [gSheetTimeview1Data, setGSheetTimeview1Data] = useState<any[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
      async function fetchData() {
        try {
          setGSheetTimeview1Data(await fetchGSheetTimeviewData(TV[0]));
        } catch (err) {
          setError('Error fetching data');
        } finally {
          setTimeview1Loading(false);
        }
      }
      fetchData();
    }, []);

    useEffect(() => {
      if (gSheetTimeview1Data.length > 0) {
        setTimeview1Data(sheet2Timeview(gSheetTimeview1Data));
      }
    }, [gSheetTimeview1Data]);

    // fetch data from gSheet into array gSheetTimeview2Data
    const [timeview2Loading, setTimeview2Loading] = useState<boolean>(true);
    const [gSheetTimeview2Data, setGSheetTimeview2Data] = useState<any[]>([]);

    useEffect(() => {
      async function fetchData() {
        try {
          setGSheetTimeview2Data(await fetchGSheetTimeviewData(TV[1]));
        } catch (err) {
          setError('Error fetching data');
        } finally {
          setTimeview2Loading(false);
        }
      }
      fetchData();
    }, []);

    useEffect(() => {
      if (gSheetTimeview2Data.length > 0) {
        setTimeview2Data(sheet2Timeview(gSheetTimeview2Data));
      }
    }, [gSheetTimeview2Data]);
  } else {
    useEffect(() => {
      // load timeview1 data
      setTimeview1Data(timeview1Json);
      setTimeview2Data(timeview2Json);
    }, []);
  }

  return (
    <>
      <Timeview1Buttons />
      <Timeview2Buttons />
    </>
  );
};

export default Timeview; 
