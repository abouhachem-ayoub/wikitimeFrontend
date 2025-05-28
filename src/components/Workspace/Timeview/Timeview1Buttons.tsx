// Third-party imports
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

// Local imports
import { ContextApp } from '../../../contexts/ContextApp';
import { spanFocusResized } from '../../../utils/misc';

interface Timeview1Entry {
  startYear: number;
  endYear: number;
  bgColor: string;
  textColor: string;
  width: string;
  caption: string;
}

interface ChartInstance {
  current: {
    dispatchAction: (action: {
      type: string;
      dataZoomIndex: number;
      startValue: number;
      endValue: number;
    }) => void;
  };
}

const Timeview1Buttons: React.FC = () => {
  const { timeview1Data, tv1Show, chartInstanceRef } = useContext(ContextApp);
  const { t: loc } = useTranslation();

  if (!tv1Show) return null;

  return (
    <div className="timeview_container">
      {timeview1Data.map((entry: Timeview1Entry, index: number) => (
        <button
          key={index}
          onClick={() => {
            const { start, end } = spanFocusResized(
              entry.startYear,
              entry.endYear,
            );
            (chartInstanceRef as ChartInstance).current.dispatchAction({
              type: 'dataZoom',
              dataZoomIndex: 0,
              startValue: start,
              endValue: end,
            });
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

export default Timeview1Buttons; 
