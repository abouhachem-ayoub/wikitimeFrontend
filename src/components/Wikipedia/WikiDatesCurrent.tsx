import { useContext, useState, useEffect } from 'react';
import { ContextWikipedia } from '../../contexts/ContextWikipedia';
import { string2date } from '../../utils/misc';

const WikiDatesCurrent: React.FC = () => {
  const { 
    currentWikipediaPageTitle, 
    currentWikipediaPageName, 
    currentWikipediaPageDateStart, 
    currentWikipediaPageDateEnd, 
    currentWikipediaPageWdId 
  } = useContext(ContextWikipedia);

  return (
    <div>
      {`
      Title: ${currentWikipediaPageTitle} - 
      Name: ${currentWikipediaPageName} - 
      wdId: ${currentWikipediaPageWdId} - 
      Start: ${currentWikipediaPageDateStart} - 
      End: ${currentWikipediaPageDateEnd}
      `}
    </div>
  );
};

export default WikiDatesCurrent;
