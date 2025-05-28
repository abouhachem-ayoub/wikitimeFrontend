import { useEffect, useContext } from 'react';
import { ContextWikipedia } from "../../contexts/ContextWikipedia";
import { useState } from 'react';

const WikipediaResults: React.FC = () => {
  const {
    queryBoxShow,
    setQueryBoxShow,
    setWikiUrl, 
    urlWikipedia, 
    searchResults,
  } = useContext(ContextWikipedia);

  const [displayResults, setDisplayResults] = useState(true);

  useEffect(() => {
    if (!queryBoxShow || !searchResults || searchResults.length === 0) {
      setDisplayResults(false);
    } else {
      setDisplayResults(true);
    }
  }, [queryBoxShow, searchResults]);

  const handleLinkClick = (pageid: number) => {
    //alert(`${urlWikipedia}/?curid=${pageid}`);
    setQueryBoxShow(false);
    setWikiUrl(`${urlWikipedia}/?curid=${pageid}`)
  };

  return (
    <>
      <div className='query-search-container'>
        {displayResults && searchResults.map((result: any) => (
          <div key={result.pageid}>
            <button className='query-search-button' onClick={() => handleLinkClick(result.pageid)}>
              <p className='query-search-title'>{result.title}</p>
              <p className='query-search-subtitle'>{result.snippet.replace(/<\/?[^>]+(>|$)/g, "")}</p>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default WikipediaResults;
//          <p>{result.snippet}</p>
//          <p>{result.snippet.replace(/<\/?[^>]+(>|$)/g, "")}</p>
