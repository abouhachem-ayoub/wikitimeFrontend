// Third-party imports
// Local imports
import { useLayersSettings } from 'hooks/useLayersSettings/useLayersSettings';
import { Layer } from 'types/pastbar';
import { ChangeEvent } from 'react';

import styles from '../PixiSettings.module.scss';

interface LayerConfig {
  name: Layer;
  visible: boolean;
}

interface PastBarSettings {
  [key: string]: number;
}

const Layers: React.FC = () => {
  const {
    toggleVisibility,
    visibilityConfig,
    pastBarSettings,
    setPastBarSettings,
    animationDuration,
    setAnimationDuration,
  } = useLayersSettings();

  const handlePastBarSettingChange = (setting: string, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value) {
      setPastBarSettings((prev) => ({
        ...prev,
        [setting]: Number(value),
      }));
    }
  };

  const handleAnimationDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value) {
      setAnimationDuration(Number(value));
    }
  };

  return (
    <>
      <div className={styles.pixiSettingsContainer}>
        {visibilityConfig.map((layer: LayerConfig, index: number) => (
          <div key={index} className={styles.settingsItem}>
            <label htmlFor={layer.name}>{layer.name}</label>
            <input
              id={layer.name}
              type="checkbox"
              checked={layer.visible}
              onChange={(event) => toggleVisibility(layer.name, event.target.checked)}
            />
          </div>
        ))}
        {Object.keys(pastBarSettings).map((setting: string, index: number) => (
          <div key={index} className={styles.pixiSettingsItem}>
            <label htmlFor={setting}>{setting}</label>
            <input
              id={setting}
              value={pastBarSettings[setting]}
              type="number"
              onChange={(event) => handlePastBarSettingChange(setting, event)}
            />
          </div>
        ))}
        <div className={styles.pixiSettingsItem}>
          <label htmlFor="animationDuration">animationDuration</label>
          <input
            id="animationDuration"
            value={animationDuration}
            type="number"
            onChange={handleAnimationDurationChange}
          />
        </div>
      </div>
    </>
  );
};

export default Layers; 
