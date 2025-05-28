// Local imports
import Layers from './Layers/Layers';
import ViewSettings from './ViewSettings/ViewSettings';

const PixiSettings: React.FC = () => {
  return (
    <div>
      <ViewSettings />
      <Layers />
      <br />
    </div>
  );
};

export default PixiSettings; 
