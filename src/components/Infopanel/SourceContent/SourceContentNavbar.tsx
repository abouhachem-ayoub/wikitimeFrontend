import { ContextWikipedia } from "../../../contexts/ContextWikipedia";
import { useState, useEffect, useContext } from 'react';

import { useTranslation } from 'react-i18next'; // localization

import WikipediaQueryBox from '../../Wikipedia/WikipediaQueryBox';

import UInavback from '../../../assets/UI_Icons/navback.svg';
import UInavforward from '../../../assets/UI_Icons/navforward.svg';
import UIbrowser from '../../../assets/UI_Icons/browser.svg';
import ButtonsList from '../Toolbar/ButtonsList';

const WikipediaNavbar: React.FC = () => {
  const {
    wikiLayoutIndex, setWikiLayoutIndex,
    moveHistoryIndexBack, moveHistoryIndexForward,
    isImage,
    backLimit, forwardLimit,
    queryBoxShow,
  } = useContext(ContextWikipedia);

  const { t: loc } = useTranslation();

  // Update layout index when `isImage` changes
  useEffect(() => {if (isImage && wikiLayoutIndex !== 0) {setWikiLayoutIndex(0);}}, [isImage, wikiLayoutIndex]);

  return (
    <div className="content-provider-navbar">
      {queryBoxShow ? (
        <WikipediaQueryBox />
      ) : (<>
        {wikiLayoutIndex === 0 ? (<ButtonsList call='wikilayout1'/>):null}
        {wikiLayoutIndex === 1 ? (<ButtonsList call='wikilayout2'/>):null}
        {wikiLayoutIndex === 2 ? (<ButtonsList call='wikilayout3'/>):null}

        <button // moveHistoryIndexBack
          title={loc("back")} // AEFF localization
          className={`toolbar_btn ${backLimit ? 'disabled' : ''}`}
          onClick={moveHistoryIndexBack}
          disabled={backLimit}
        >
          <img src={UInavback} alt={loc("back")} className="toolbar_icons" /> {/* AEFF localization */}
        </button>

        <button // moveHistoryIndexForward
          title={loc("forward")} // AEFF localization
          className={`toolbar_btn ${forwardLimit ? 'disabled' : ''}`}
          onClick={moveHistoryIndexForward}
          disabled={forwardLimit}
        >
          <img
            src={UInavforward}
            alt={loc("forward")} // AEFF localization
            className="toolbar_icons"
          />
        </button>

        <ButtonsList call='wikinewtab' />
        <ButtonsList call='source_wiki' />
      </>)}
    </div>
  );
};

export default WikipediaNavbar;
