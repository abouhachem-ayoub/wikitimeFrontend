import { divide } from 'lodash';
import Spacevideo from '../../assets/videos/spacevideo.mp4';
import { useUser } from 'contexts/UserContext';
const BgdVideo: React.FC = () => {
  const {userId} = useUser()
  if(!userId){
    return(<div><h1>Log in to view the cosmos</h1></div>)
  }
  return (
    <video src={Spacevideo} muted playsInline autoPlay loop></video>
  );
};

export default BgdVideo;
