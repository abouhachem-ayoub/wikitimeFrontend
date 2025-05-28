// Third-party imports
// Local imports
import { useFps } from 'hooks/useFps';
import { usePastBarData } from 'hooks/usePastBarDataV2/usePastBarData';
import { useTimeBoxPosition } from 'hooks/useTimeBoxPosition/useTimeBoxPosition';
import { getMemoryUsage } from 'utils/memoryUsage';
import { ChangeEvent, useEffect, useState } from 'react';

import styles from '../PixiSettings.module.scss';

interface TimeBoxData {
  startTs: number;
  endTs: number;
}

const ViewSettings: React.FC = () => {
  const { periods, setPeriods } = useTimeBoxPosition();
  const { fps } = useFps();
  const { currentZoomScaleData } = usePastBarData();
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [timeBoxData, setTimeBoxData] = useState<TimeBoxData>({
    startTs: 1500,
    endTs: 1800,
  });

  const handleTimeBoxDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTimeBoxData((prevData) => ({
      ...prevData,
      [name]: Number(value),
    }));
  };

  useEffect(() => {
    setMemoryUsage(Number(getMemoryUsage()));
  }, [fps]);

  useEffect(() => {
    setPeriods([{ startTs: timeBoxData.startTs, endTs: timeBoxData.endTs }]);
  }, [timeBoxData]);

  return (
    <div>
      <div className={styles.pixiSettingsContainer}>
        <label htmlFor="timeBoxStart">timeBoxStart</label>
        <input
          type="number"
          id="timeBoxStart"
          name="startTs"
          value={timeBoxData.startTs}
          onChange={handleTimeBoxDataChange}
        />
        <label htmlFor="timeBoxEnd">timeBoxEnd</label>
        <input
          type="number"
          id="timeBoxEnd"
          name="endTs"
          value={timeBoxData.endTs}
          onChange={handleTimeBoxDataChange}
        />
        <label> - {fps} fps</label>
        <label> - {memoryUsage} MB</label>
        <label> - zoomScale = {currentZoomScaleData?.id}</label>
      </div>
    </div>
  );
};

export default ViewSettings; 
