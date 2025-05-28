import Spacevideo from '../../assets/videos/spacevideo.mp4';

const BgdVideo: React.FC = () => {
  return (
    <video src={Spacevideo} muted playsInline autoPlay loop></video>
  );
};

export default BgdVideo;
