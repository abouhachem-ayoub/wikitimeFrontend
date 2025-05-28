// Third-party imports
// Local imports
import { ZoomScaleList } from 'config/zoomscale';
import { ContextApp } from 'contexts/ContextApp';
import { usePastBarData } from 'hooks/usePastBarDataV2/usePastBarData';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

interface Timeview2Entry {
  bgColor: string;
  textColor: string;
  width: string;
  caption: string;
}

const Timeview2Buttons: React.FC = () => {
  const { timeview2Data, tv2Show } = useContext(ContextApp);
  const { t: loc } = useTranslation();
  const { jumpToZoomScale } = usePastBarData();

  if (!tv2Show) return null;

  return (
    <div className="timeview_container">
      {timeview2Data.map((entry: Timeview2Entry, index: number) => (
        <button
          key={index}
          onClick={() => {
            jumpToZoomScale(ZoomScaleList[index]);
          }}
          className="timeview_buttons"
          style={{
            backgroundColor: entry.bgColor,
            color: entry.textColor,
            width: entry.width,
          }}
        >
          {loc(entry.caption)}
        </button>
      ))}
    </div>
  );
};

export default Timeview2Buttons; 
