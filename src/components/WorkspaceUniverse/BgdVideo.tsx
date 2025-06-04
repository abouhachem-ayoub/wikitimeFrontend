import { divide } from 'lodash';
import Spacevideo from '../../assets/videos/spacevideo.mp4';
import { useUser } from 'contexts/UserContext';
const BgdVideo: React.FC = () => {
 
  return (
    <video src={Spacevideo} muted playsInline autoPlay loop></video>
  );
};

export default BgdVideo;
