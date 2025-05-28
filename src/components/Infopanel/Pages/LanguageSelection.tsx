import { useTranslation } from 'react-i18next'; // localization
import ButtonsList from "../Toolbar/ButtonsList";

const LanguageSelection: React.FC = () => {
  const { t: loc } = useTranslation();
  return (
    <div className='settings-container'>
      {loc('language_select')} {loc('language')}
      <br />
      <div className='flag-container'>
        <ButtonsList call='lg_en' /> {/* 6.9 million wikipedia pages */}
        <ButtonsList call='lg_de' /> {/* 2.8 million wikipedia pages */}
        <ButtonsList call='lg_sv' /> {/* 2.6 million wikipedia pages */}
        <ButtonsList call='lg_fr' /> {/* 2.5 million wikipedia pages */}
        <ButtonsList call='lg_nl' /> {/* 2.1 million wikipedia pages */}
        <ButtonsList call='lg_ru' /> {/* 1.9 million wikipedia pages */}
        <ButtonsList call='lg_it' /> {/* 1.8 million wikipedia pages */}
        <ButtonsList call='lg_es' /> {/* 1.7 million wikipedia pages */}
        <ButtonsList call='lg_pl' /> {/* 1.6 million wikipedia pages */}
      </div>
    </div>
  );
};

export default LanguageSelection;
