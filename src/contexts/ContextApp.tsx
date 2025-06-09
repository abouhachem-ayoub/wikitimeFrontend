import { createContext, useEffect, useRef, useState, ReactNode } from "react";

// Create the context
export const ContextApp = createContext<any>(null);

// Create a provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const root = document.documentElement;
  const maxSplitH = 100*(1-(parseFloat(getComputedStyle(root).getPropertyValue('--value-TBSize')) / window.innerWidth));
  const maxSplitV = 100*(1-(parseFloat(getComputedStyle(root).getPropertyValue('--value-TBSize')) / window.innerHeight));

  const [isVertical, setIsVertical] = useState(false); // Toolbar orientation = vertical?
  const [isDragging, setIsDragging] = useState(false); // Is the toolbar being dragged?
  const [splitV, setSplitV] = useState(maxSplitH); // % vertical toolbar position
  const [splitH, setSplitH] = useState(maxSplitV); // % horizontal toolbar position
  const split = isVertical ? splitV : splitH; // Define split position

  const canvasRef = useRef<HTMLDivElement | null>(null); // main container
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<any>(null);

  const [wikiBtnsShow, setWikiBtnsShow] = useState(true); // Show wikipedia debug buttons in workspace
  const [wsBackgd, setWsBackgd] = useState(0); //wsBackgd => 0: no background, 1: video, 2: three.js, 3: three.js  // AEFFsettings
  const [wsPixiShow, setWsPixiShow] = useState(true);

  //timeview
  const [timeview1Data, setTimeview1Data] = useState<any[]>([]); // data transformed for timeview
  const [timeview2Data, setTimeview2Data] = useState<any[]>([]); // data transformed for timeview
  const [fetchTimeviewFromGsheet, setFetchTimeviewFromGsheet] = useState(false);
  const [tv1Show, setTv1Show] = useState(true);
  const [tv2Show, setTv2Show] = useState(false);
  const [timeview1Edit, setTimeview1Edit] = useState(false);
  const [timeview2Edit, setTimeview2Edit] = useState(false);

  // Background
  // Chart timePanel
  const [timePanelData, setTimePanelData] = useState<any[]>([]); // TimePanel data
  const [infopanelShow, setInfopanelShow] = useState<string>("");
  const [actionParam, setActionParam] = useState<string | null>(null); // Track the action parameter

  //console.log('ContextApp split:', split.toFixed(1), 'splitV:', splitV.toFixed(1),  'splitH:', splitH.toFixed(1));
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");

    if (action === "resetPassword" || action === "verifyEmail") {
      setActionParam(action);
      if (isVertical) {
        setSplitV(40); // Set Infopanel to take 40% of the screen height
      } else {
        setSplitH(40); // Set Infopanel to take 40% of the screen width
      }
      setInfopanelShow("account"); // Automatically show the account panel
    } else {
      setActionParam(null);
    }
  }, [isVertical]);

  useEffect(() => {
    root.style.setProperty('--color-IPNavbar', isVertical ? 'var(--color-IPNavbar-vertical)' : 'var(--color-IPNavbar-horizontal)');
    root.style.setProperty('--value-TBflex', isVertical ? 'var(--value-TBflex-vertical)' : 'var(--value-TBflex-horizontal)');
    root.style.setProperty('--value-TBflexOpp', isVertical ? 'var(--value-TBflexOpp-vertical)' : 'var(--value-TBflexOpp-horizontal)');
  }, [isVertical]);

  return (
    <ContextApp.Provider
      value={{
        isVertical,      
        setIsVertical,
        split,
        splitH,          
        setSplitH,        
        maxSplitH,
        splitV,          
        setSplitV,       
        maxSplitV,
        isDragging,      
        setIsDragging,

        timePanelData,       
        setTimePanelData,
        infopanelShow,   
        setInfopanelShow,
        //setInfopanel,

        wikiBtnsShow,       
        setWikiBtnsShow,
        timeview1Data,   
        setTimeview1Data,
        timeview2Data,   
        setTimeview2Data,
        timeview1Edit,   
        setTimeview1Edit,
        timeview2Edit,   
        setTimeview2Edit,
        
        tv1Show,   
        setTv1Show,
        tv2Show,   
        setTv2Show,
        fetchTimeviewFromGsheet, 
        setFetchTimeviewFromGsheet,
        wsBackgd,        
        setWsBackgd,
        wsPixiShow,       
        setWsPixiShow,
        canvasRef,        
        chartContainerRef,
        chartInstanceRef, 
      }}
    >
      {children}
    </ContextApp.Provider>
  );
};