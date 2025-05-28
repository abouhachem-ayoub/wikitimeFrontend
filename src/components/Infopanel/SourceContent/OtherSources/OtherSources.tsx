import ButtonsList from 'components/Infopanel/Toolbar/ButtonsList';
import { useTranslation } from 'react-i18next'; //localization

const OtherSources: React.FC = () => {
  const { t: loc } = useTranslation();

  return (
    <>
      <div className='other-sources'>
        {loc('source_possible')}<br/>
        <ButtonsList call='source05'/> {/*IMDB*/}
        <ButtonsList call='source03'/> {/*Citizendium*/}
        <ButtonsList call='source01'/> {/*Baidu Baike*/}
        <ButtonsList call='source08'/> {/*Qiuwen Baike*/}
        <ButtonsList call='source10'/> {/*Unesco*/}
        <ButtonsList call='source04'/> {/*encyclopedia.com*/}
        <ButtonsList call='source06'/> {/*Internet Archive*/}
        <ButtonsList call='source07'/> {/*Project Gutemberg*/}
        <ButtonsList call='source09'/> {/*Scholarpedia*/}
        <ButtonsList call='source02'/> {/*Britannica*/}
        <ButtonsList call='source11'/> {/*Wikipedia*/}
        <ButtonsList call='source12'/> {/*World History*/}
      </div>
    </>
  );
};

export default OtherSources;
