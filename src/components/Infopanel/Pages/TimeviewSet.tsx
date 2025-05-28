import { useState } from 'react';

const TimeviewSet: React.FC = () => {
  const [timeviewIndex, setTimeviewIndex] = useState(0);
  const [edit, setEdit] = useState(0);
  const [displayTV, setDisplayTV] = useState(0);

  const handleButtonClick = () => {setTimeviewIndex((previousIndex) => (previousIndex + 1) % gSheetUrl.length);};

  const prefix = 'https://docs.google.com/spreadsheets/d/';
  const sheetId = ['1cKUsrnTdMA9U9S91qDBUHUEjn5nhhKtXBKz4O3eklnE', '1DcxGB7QwNe8-seobxoyLi4YAZRJTllssO2dJAIckDmc'];
  const suffix = edit === 0 ? '/pubhtml?gid=' : '/edit?gid=';
  const gid = ['1540636112', '0'];
  const gSheetUrl = [prefix + sheetId[0] + suffix + gid[0], prefix + sheetId[1] + suffix + gid[1]];

  return (
    <>
      <div className="content-provider-navbar">

         {/* AEFFsettings: allow your own googlesheetsid + other settings */}

         {/* TV number */}
        <button 
          onClick={handleButtonClick}
          className='tvsettings-button'>
          Timeview {timeviewIndex}
        </button>

         {/* display TV on/off */}
        <button
          onClick={() => setDisplayTV((prevDisplayTV) => (prevDisplayTV === 0 ? 1 : 0))} 
          className={`${displayTV === 0 ? 'tvsettings-button' : 'tvsettings-buttonActive'}`}>
          Display {displayTV === 0 ? 'off' : 'on'}
        </button> {/* //AEFFlocalization */}

         {/* edit on/off */}
         <button 
          onClick={() => setEdit((prevPub) => (prevPub === 0 ? 1 : 0))} 
          className={`${edit === 0 ? 'tvsettings-button' : 'tvsettings-buttonActive'}`}>
          Edit {edit === 0 ? 'off' : 'on'}
        </button> {/* //AEFFlocalization */}

      </div>

      <iframe src={gSheetUrl[timeviewIndex]} style={{width: '100%', height: edit === 0 ? '220px' : '350px'}}/>
    </>
  );
};

export default TimeviewSet;