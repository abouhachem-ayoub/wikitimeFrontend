import { ContextApp } from "../../contexts/ContextApp";
import { useEffect, useRef, useState, useContext } from 'react';

import Account from './Pages/Account';
import Toolbar from "./Toolbar/Toolbar";
import OtherSources from "./SourceContent/OtherSources/OtherSources";
import Settings from "./Settings/Settings";
import Catalogs from "./Pages/Catalogs";
import Database from "./Pages/Database";
import DisplayTable from "./Pages/DisplayTable";
import Load from "./Pages/Load";
import TimeviewSet from "./Pages/TimeviewSet";
import Trello from "./Pages/Trello";
import Wikipedia from "../Wikipedia/Wikipedia";


const Infopanel: React.FC = () => {
  const {
    isDragging,
    wikiUrl,
    infopanelShow, setInfopanelShow,
    timePanelData,
  } = useContext(ContextApp);
  const params = new URLSearchParams(window.location.search);
    const action = params.get("action"); // e.g., ?action=resetPassword or ?action=verifyEmail
    useEffect(() => {
    if (action === "resetPassword" || action === "verifyEmail") {
      setInfopanelShow("account"); // Automatically show the account panel
    }
  }, [setInfopanelShow, action]);

  useEffect(() => {if (wikiUrl !== '') {setInfopanelShow('wikipedia');}}, [wikiUrl]);

  return (
    <div className={'infopanel-container'}>

      <Toolbar />

      <div className={'infopanel-canvas'}>

        {infopanelShow === 'account'        && <Account />}
        {infopanelShow === 'catalogs'       && <Catalogs />}
        {infopanelShow === 'load'           && <Load />}
        {infopanelShow === 'database'       && <Database />}
        {infopanelShow === 'othersources'   && <OtherSources />}
        {infopanelShow === 'timepaneltable' && <DisplayTable title="timePanelData" data={timePanelData} />}
{/*
        {infopanelShow === 'timelinetable'  && <DisplayTable title="nTLParameters" data={timeLine} />}
*/}
        {infopanelShow === 'timeviewset'    && <TimeviewSet />}
        {infopanelShow === 'trello'         && <Trello />}
        {infopanelShow === 'wikipedia'      && <Wikipedia />}

        {infopanelShow === 'settings'       && <Settings />}

      </div>

      {isDragging && <div className="drag_overlay" />}
    </div>
  );
};

export default Infopanel;
