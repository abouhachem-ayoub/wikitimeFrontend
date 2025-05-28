import { useFps, usePastBarData } from 'hooks';
import { useEffect, useState, ChangeEvent } from 'react';

import { getMemoryUsage } from '../../../../utils/memoryUsage.ts';
import styles from '../PixiSettings.module.scss';

const ViewStartEnd: React.FC = () => {
  const [viewStart, setViewStart] = useState<number>(-2500);
  const [viewEnd, setViewEnd] = useState<string>('01/01/1922');
  const { fps } = useFps();
  const { currentZoomScaleData } = usePastBarData();
  const [memoryUsage, setMemoryUsage] = useState<number>(0);

  // Bogdan,
  // this is a tentative to display viewStart and viewEnd... convenient for tests
  // I guess you will do it differently, anyway we'll discuss about it

  useEffect(() => {
    setMemoryUsage(Number(getMemoryUsage()));
  }, [fps]);

  const handleViewStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setViewStart(Number(e.target.value));
  };

  const handleViewEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setViewEnd(e.target.value);
  };

  return (
    <div>
      <div className={styles.pixiSettingsContainer}>
        <label htmlFor="viewStart">viewStart</label>
        <input
          type="number"
          id="viewStart"
          value={viewStart}
          onChange={handleViewStartChange}
        />
        <label htmlFor="viewEnd">viewEnd</label>
        <input
          type="text"
          id="viewEnd"
          value={viewEnd}
          onChange={handleViewEndChange}
        />
        <label> - {fps} fps</label>
        <label> - {memoryUsage} MB</label>
        <label> - zoomScale = {currentZoomScaleData?.id}</label>
      </div>
    </div>
  );
};

export default ViewStartEnd;
