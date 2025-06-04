import Timeview from 'components/Workspace/Timeview/Timeview';
import WorkspaceTime from 'components/Workspace/WorkspaceTime/WorkspaceTime';
import { ContextApp } from 'contexts/ContextApp';
import { ContextWikipedia } from 'contexts/ContextWikipedia';
import { FpsProvider, PastBarDataProvider } from 'hooks/index';
import { TimeBoxPositionProvider } from 'hooks/useTimeBoxPosition/useTimeBoxPosition';
import { useContext, useEffect, useRef } from 'react';
import WikiButtons from './WikiButtons/WikiButtons';
import WikiDatesCurrent from 'components/Wikipedia/WikiDatesCurrent';
import WikiDatesTable from 'components/Wikipedia/WikiDatesTable';
import BgdVideo from 'components/WorkspaceUniverse/BgdVideo';
import BgdGalaxy from 'components/WorkspaceUniverse/BgdGalaxy';
import { useUser } from 'contexts/UserContext';
import toast, { Toaster } from 'react-hot-toast';

const Workspace = () => {
  const {
    wsBackgd,
    wikiBtnsShow,
    setWikiBtnsShow,
    setInfopanelShow,
    setSplitH,
    setTv2Show,
    wsPixiShow, setWsPixiShow, 
  } = useContext(ContextApp);
  const {userId,setUserId} = useUser();
  let userLoggedIn = false
  if(userId !== null){
  localStorage.setItem('useridfromtimespace',userId);
  userLoggedIn= true;
}
  const { handleWikiNameChange, wikiDatesShow, setWikiDatesShow } =
    useContext(ContextWikipedia);
  const workspaceRef = useRef(null); // Define workspaceRef here

  useEffect(() => {handleWikiNameChange('Dumas_(musician)')}, []);                   //DEVWikipedia load WP
//  useEffect(() => {setSplitH(90)}, []);                                              //DEVWikipedia splitH
  useEffect(() => {setWikiDatesShow(false)}, []);                                    //DEVWikipedia show wiki buttons
  useEffect(() => {setWikiBtnsShow(false)}, []);                                     //DEVWikipedia show wiki buttons
  useEffect(() => {setInfopanelShow('timepaneltable')}, []);                         //DEVChart
  useEffect(() => {setTv2Show(true);}, []);                                          //DEVTimeline show wiki buttons
  useEffect(() => {setWsPixiShow()}, []);                                        //DEVTimeline show wiki buttons
  useEffect(() => {setInfopanelShow("timelinetable");}, []); 
  useEffect(() => {
    setTv2Show(true);
  }, []); //DEVTimeline show wiki buttons
  useEffect(() => {
    setInfopanelShow('timelinetable');
  }, []); //DEVTimeline
                                      //DEVWikipedia show wiki buttons
  useEffect(()=>{
    if(!userId && (wsBackgd == 1 || wsBackgd == 2)){
      toast.error('you have to be logged in to view the cosmos',{
        position: 'bottom-center',
      })}
  },[userId,wsBackgd])

  return (
    <div className="workspace-container">
      <div className="workspace-background">
        {wsBackgd === 2 && (
          <canvas ref={workspaceRef} className="workspace-canvas"></canvas>)}
          {(wsBackgd === 1 && userId)  ?  <BgdVideo /> : <div ><Toaster/></div>}                                            {/*//DEVWorkspaceUniverse */}
          {(wsBackgd === 2 && userId)  ? <BgdGalaxy workspaceRef={workspaceRef}/> : <div><Toaster/></div>}               {/*//DEVWorkspaceUniverse */}
          {/*wsBackgd === 3  && <BgdCosmos workspaceRef={workspaceRef}/>*/}                {/*//DEVWorkspaceUniverse */}
        
      </div>
      <div className="workspace-content">
        <FpsProvider>
          <PastBarDataProvider>
            <TimeBoxPositionProvider>
              {wikiBtnsShow  && <WikiButtons/>}                                            {/*//DEVWikipedia */}
              {wikiDatesShow  && <WikiDatesCurrent />}                                     {/*//DEVWikipedia */}
              {wikiDatesShow  && <WikiDatesTable />} 
              <Timeview />
              {<WorkspaceTime />}
            </TimeBoxPositionProvider>
          </PastBarDataProvider>
        </FpsProvider>
      </div>
    </div>
  );
};

export default Workspace;
