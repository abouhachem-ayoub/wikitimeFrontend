// Third-party imports
import Workspace from "./Workspace/Workspace";
// Local imports
import { useEffect, useContext, CSSProperties } from "react";
import { ContextApp } from "../contexts/ContextApp";
import Infopanel from "./Infopanel/Infopanel";
import { handleFetchTimePanelData } from "../utils/fetchTimePanelData";

const Wikitime: React.FC = () => {
  const {
    isVertical,
    isDragging,
    splitV,
    splitH,
    canvasRef,
    setTimePanelData,
  } = useContext(ContextApp);

  const noSelectStyle: CSSProperties = { // style object to disable text selection
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await handleFetchTimePanelData('json/timePanel_test.json');
/*
      const data = await handleFetchTimePanelData('json/timePanel_01short.json');
      const data = await handleFetchTimePanelData('json/timePanel_02timeviews.json');
      const data = await handleFetchTimePanelData('json/timePanel_03recentcharacters.json');
      const data = await handleFetchTimePanelData('json/timePanel_07longperiods.json');
      const data = await handleFetchTimePanelData('json/timePanel_10manyitems.json');
*/
      setTimePanelData(data);
    };
    fetchData();
  }, []);

  return (
    <div
      ref={canvasRef}
      className="canvas"
      style={{ ...(isDragging ? noSelectStyle : {}) }}
    >
      <div style={isVertical ? { height: `${splitV}%` } : { width: `${splitH}%` }}>
        <Workspace />
      </div>

      <div style={isVertical ? { height: `${100 - splitV}%` } : { width: `${100 - splitH}%` }}>
        <Infopanel />
      </div>
    </div>
  );
};

export default Wikitime; 
