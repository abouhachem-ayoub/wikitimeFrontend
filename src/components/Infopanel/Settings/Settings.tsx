import LanguageSelection from "../Pages/LanguageSelection";
import Sources from "../Pages/Sources";

const Settings: React.FC = () => {
  return (
    <div className='settings-container'>
      <LanguageSelection />        {/* show language selection */}
      <Sources />                  {/* show sources */}
    </div>
  );
};

export default Settings;
