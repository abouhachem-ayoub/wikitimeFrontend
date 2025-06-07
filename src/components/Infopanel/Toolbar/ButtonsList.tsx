import { useContext, useEffect,useState } from 'react';
import { ContextApp } from 'contexts/ContextApp';
import { ContextWikipedia } from 'contexts/ContextWikipedia';
import { useTranslation } from 'react-i18next'; //localization
import { useUser } from 'contexts/UserContext';
import { changeLanguage } from '../../../config/i18n';

// UIicons
import UIsearch from      '../../../assets/UI_Icons/search.svg';
import UIwikipedia from      '../../../assets/UI_Icons/wikilayout1.svg';
import UIsettings from       '../../../assets/UI_Icons/settings.svg';
import UItransposition from  '../../../assets/UI_Icons/transposition.svg';
import UIaccountTeacher from '../../../assets/UI_Icons/accountTeacher.svg';
import UIaccountPro from     '../../../assets/UI_Icons/accountPro.svg';
import UIaccountUser from    '../../../assets/UI_Icons/accountUser.svg';
import UItimeviewset1 from      '../../../assets/UI_Icons/timeviewset1.svg';
import UItimeviewset2 from      '../../../assets/UI_Icons/timeviewset2.svg';
import UItimeview1 from      '../../../assets/UI_Icons/timeview1.svg';
import UItimeview2 from      '../../../assets/UI_Icons/timeview2.svg';
import UItimeview3 from      '../../../assets/UI_Icons/timeview3.svg';
import UItimeview4 from      '../../../assets/UI_Icons/timeview4.svg';
import UIcatalogs from       '../../../assets/UI_Icons/catalogs.svg';
import UIdisk from           '../../../assets/UI_Icons/disk.svg';
import UIdatabase from       '../../../assets/UI_Icons/database.svg';
import UItrellopink from     '../../../assets/UI_Icons/trello_pink.svg';
import UItable from          '../../../assets/UI_Icons/table.svg';
import UIchart from          '../../../assets/UI_Icons/chart.svg';
import UIpixi from          '../../../assets/UI_Icons/pixi.svg';
import UIcosmos from         '../../../assets/UI_Icons/cosmos.svg';
import UIwikidates from      '../../../assets/UI_Icons/wikidates.svg';
import UIwikipage from       '../../../assets/UI_Icons/wikipage.svg';
import UIsource from         '../../../assets/UI_Icons/source.svg';
import UIwsDebugbtn from     '../../../assets/UI_Icons/mask.svg';
// categories
import UICatScience from     '../../../assets/UI_Icons/CategoryScience.svg';
import UICatPower from       '../../../assets/UI_Icons/CategoryPower.svg';
import UICatCulture from     '../../../assets/UI_Icons/CategoryCulture.svg';
import UICatTrade from       '../../../assets/UI_Icons/CategoryTrade.svg';
import UICatSoul from        '../../../assets/UI_Icons/CategorySoul.svg';
// https://flagicons.lipis.dev/
import lg_en from            '../../../assets/flags/lg_en.svg';
import lg_fr from            '../../../assets/flags/lg_fr.svg';
import lg_it from            '../../../assets/flags/lg_it.svg';
import lg_de from            '../../../assets/flags/lg_de.svg';
import lg_es from            '../../../assets/flags/lg_es.svg';
import lg_nl from            '../../../assets/flags/lg_nl.svg';
import lg_pl from            '../../../assets/flags/lg_pl.svg';
import lg_ru from            '../../../assets/flags/lg_ru.svg';
import lg_sv from            '../../../assets/flags/lg_sv.svg';
// wikipedia pages
import UIwikilayout1 from    '../../../assets/UI_Icons/wikilayout1.svg';
import UIwikilayout2 from    '../../../assets/UI_Icons/wikilayout2.svg';
import UIwikilayout3 from    '../../../assets/UI_Icons/wikilayout3.svg';
import UInavback from        '../../../assets/UI_Icons/navback.svg';
import UInavforward from     '../../../assets/UI_Icons/navforward.svg';
import UIbrowser from        '../../../assets/UI_Icons/browser.svg';
//Other sources
import sourceLogo01 from      '../../../assets/source_contents/logo_baidubaike.svg';       //https://baike.baidu.com
import sourceLogo02 from      '../../../assets/source_contents/logo_britannica.svg';       //https://www.britannica.com
import sourceLogo03 from      '../../../assets/source_contents/logo_citizendium.svg';      //https://en.citizendium.org
import sourceLogo04 from      '../../../assets/source_contents/logo_encyclopedia.com.svg'; //https://www.encyclopedia.com
import sourceLogo05 from      '../../../assets/source_contents/logo_imdb.svg';             //https://www.imdb.com
import sourceLogo06 from      '../../../assets/source_contents/logo_internetarchive.svg';  //https://archive.org
import sourceLogo07 from      '../../../assets/source_contents/logo_projectgutemberg.svg'; //https://gutenberg.org
import sourceLogo08 from      '../../../assets/source_contents/logo_qiuwenbaike.svg';      //https://en.prolewiki.org/wiki/Qiuwen_Baike
import sourceLogo09 from      '../../../assets/source_contents/logo_scholarpedia.svg';     //http://www.scholarpedia.org
import sourceLogo10 from      '../../../assets/source_contents/logo_unesco.svg';           //https://www.unesco.org
import sourceLogo11 from      '../../../assets/source_contents/logo_wikipedia.svg';        //https://www.wikipedia.org
import sourceLogo12 from      '../../../assets/source_contents/logo_worldhistory.svg';     //https://www.worldhistory.org
const [accountLogo, setAccountLogo] = useState(UIaccountPro); // Default logo
const {userId,setUserId} = useUser(); 
// userId is used to determine the type of account (teacher, pro, user)
interface ButtonsListProps {
  call: string;
}

const ButtonsList = ({ call }: ButtonsListProps) => {

  const { t: loc } = useTranslation();
  const { 
    setInfopanelShow, isVertical, setIsVertical,
    wsBackgd, setWsBackgd,
    wikiBtnsShow, setWikiBtnsShow,
    tv1Show, setTv1Show,
    tv2Show, setTv2Show,
    timeview1Edit, setTimeview1Edit,
    timeview2Edit, setTimeview2Edit,
    wsPixiShow, setWsPixiShow,
  } = useContext(ContextApp);
  const { 
    linkUrl,
    handleWikiNameChange,
    handleWikiLayoutChange,
    setWikiDatesShow,
    setQueryBoxShow,
  } = useContext(ContextWikipedia);
  useEffect(() => {
    // Update the logo based on whether userId is set or null
    if (userId) {
      setAccountLogo(UIaccountUser); // Logo for logged-in users
    } else {
      setAccountLogo(UIaccountPro); // Logo for guests
    }
  }, [userId]);

  const ButtonsList = [
// Toolbar
//  [call/caption      , tooltip from loc     , image          ,txt,img, V , H , functionName             , parameter]
    ['account'         , 'account_normal'     , accountLogo , 0 , 0 , 4 , 1 , 'setInfopanelShow'       , 'account'],

    ['wikibtns_show'   , 'wikibtns_show'      , UIwsDebugbtn   , 0 , 0 , 4 , 3 , 'ToggleWikiBtnsShow'     , ''],
    ['search'          , 'search_show'        , UIsearch       , 0 , 0 , 4 , 2 , 'TogglequeryBoxShow'     , ''],
    ['timeview1_show'  , 'timeview1_show'     , UItimeview1    , 0 , 0 , 4 , 2 , 'ToggleTimeview1'        , ''],
    ['timeview2_show'  , 'timeview2_show'     , UItimeview2    , 0 , 0 , 4 , 2 , 'ToggleTimeview2'        , ''],
    ['pixi_show'       , 'pixi_show'          , UIpixi         , 0 , 0 , 4 , 2 , 'TogglePixiDisplay'     , ''],
    ['wikidates_show'  , 'wikidates_show'     , UIwikidates    , 0 , 0 , 4 , 2 , 'ToggleWikiDatesShow'    , ''],
    ['cosmos'          , 'cosmos_show'        , UIcosmos       , 0 , 0 , 4 , 2 , 'ToggleWsBackground'     , ''],

    ['wikipage'        , 'wikipage_show'      , UIwikipage     , 0 , 0 , 4 , 2 , 'setInfopanelShow'       , 'wikipedia'],
    ['timepanel'       , 'timepanel_show'     , UItable        , 0 , 0 , 4 , 2 , 'setInfopanelShow'       , 'timepaneltable'],
    ['timeview1_set'   , 'timeview1_set'      , UItimeviewset1 , 0 , 0 , 4 , 2 , 'setInfopanelShow'       , 'timeview1set'],
    ['timeview2_set'   , 'timeview2_set'      , UItimeviewset2 , 0 , 0 , 4 , 2 , 'setInfopanelShow'       , 'timeview2set'],
    ['catalogs'        , 'catalogs_show'      , UIcatalogs     , 0 , 0 , 4 , 2 , 'setInfopanelShow'       , 'catalogs'],
    ['load'            , 'load'               , UIdisk         , 0 , 0 , 4 , 2 , 'setInfopanelShow'       , 'load'],
    ['database'        , 'database_show'      , UIdatabase     , 0 , 0 , 4 , 2 , 'setInfopanelShow'       , 'database'],
    ['source_possible' , 'source_possible'    , UIsource       , 0 , 0 , 4 , 2 , 'setInfopanelShow'       , 'othersources'],
    ['source_wiki'     , 'source_possible'    , sourceLogo11   , 0 , 4 , 8 , 8 , 'setInfopanelShow'       , 'othersources'],
    ['settings'        , 'settings'           , UIsettings     , 0 , 0 , 4 , 3 , 'setInfopanelShow'       , 'settings'],

    ['trello'          , 'trello'             , UItrellopink   , 0 , 0 , 4 , 2 , 'setInfopanelShow'       , 'trello'],
    ['transpose'       , 'toggle_vh'          , UItransposition, 0 , 0 , 4 , 3 , 'transpose'              , ''],
//
// WikiButtons
//  [call/caption      , tooltip from loc     , image          ,txt,img, V , H , functionName             , parameter]
    ['Sun'             ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Solar_System'],
    ['Plato'           ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Plato'],
    ['Einstein'        ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Albert_Einstein'],
    ['Sapiens'         ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Human'],
    ['Universe'        ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Universe'],
    ['van Gogh'        ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Vincent_van_Gogh'],
    ['Bonger'          ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Andries_Bonger'],
    ['Theo'            ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Theo_van_Gogh_(art_dealer)'],
    ['GMM'             ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Guy_Mamou-Mani'],
    ['Dumas'           ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Dumas_(musician)'],
    ['Goupil'          ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Eugène_Goupil'],
    ['FurtherReading'  ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Shakespeare%27s_plays'],
    ['ExternalLink'    ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Shakespeare%27s_plays'],
    ['Publications'    ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Albert_Einstein'],
    ['Awards&'         ,                      ,                , 1 , 0 , 0 , 0 , 'handleWikiNameChange'   , 'Albert_Einstein'],
//
// LanguageSelection
//  [call/caption      , tooltip from loc     , image          ,txt,img, V , H , functionName             , parameter]
    ['lg_en'           ,                      , lg_en          , 0 , 1 , 0 , 0 , 'changeLanguage'         , 'en'],
    ['lg_fr'           ,                      , lg_fr          , 0 , 1 , 0 , 0 , 'changeLanguage'         , 'fr'],
    ['lg_it'           ,                      , lg_it          , 0 , 1 , 0 , 0 , 'changeLanguage'         , 'it'],
    ['lg_de'           ,                      , lg_de          , 0 , 1 , 0 , 0 , 'changeLanguage'         , 'de'],
    ['lg_es'           ,                      , lg_es          , 0 , 1 , 0 , 0 , 'changeLanguage'         , 'es'],
    ['lg_nl'           ,                      , lg_nl          , 0 , 1 , 0 , 0 , 'changeLanguage'         , 'nl'],
    ['lg_pl'           ,                      , lg_pl          , 0 , 1 , 0 , 0 , 'changeLanguage'         , 'pl'],
    ['lg_ru'           ,                      , lg_ru          , 0 , 1 , 0 , 0 , 'changeLanguage'         , 'ru'],
    ['lg_sv'           ,                      , lg_sv          , 0 , 1 , 0 , 0 , 'changeLanguage'         , 'sv'],
//
// WikipediaNavbar
//  [call/caption      , tooltip from loc     , image          ,txt,img, V , H , functionName             , parameter]
    ['wikilayout1'     , 'wikilayout'         , UIwikilayout1  , 0 , 0 , 7 , 7 , 'handleWikiLayoutChange' , '' ],
    ['wikilayout2'     , 'wikilayout'         , UIwikilayout2  , 0 , 0 , 7 , 7 , 'handleWikiLayoutChange' , '' ],
    ['wikilayout3'     , 'wikilayout'         , UIwikilayout3  , 0 , 0 , 7 , 7 , 'handleWikiLayoutChange' , '' ],
    ['wikinewtab'      , 'wikinewtab'         , UIbrowser      , 0 , 0 , 7 , 7 , 'openWikiNewTab'         , '' ],
//
// OtherSources
//  [call/caption      , tooltip from loc     , image          ,txt,img, V , H , functionName             , parameter]
    ['source01'        , 'source01'           , sourceLogo01   , 0 , 2 , 0 , 0 , ''                       , '01 Baidu Baike' ],
    ['source02'        , 'source02'           , sourceLogo02   , 0 , 2 , 0 , 0 , ''                       , '02 Britannica' ],
    ['source03'        , 'source03'           , sourceLogo03   , 0 , 2 , 0 , 0 , ''                       , '03 Citizendium' ],
    ['source04'        , 'source04'           , sourceLogo04   , 0 , 2 , 0 , 0 , ''                       , '04 encyclopedia.com' ],
    ['source05'        , 'source05'           , sourceLogo05   , 0 , 2 , 0 , 0 , ''                       , '05 IMDB' ],
    ['source06'        , 'source06'           , sourceLogo06   , 0 , 2 , 0 , 0 , ''                       , '06 Internet Archive' ],
    ['source07'        , 'source07'           , sourceLogo07   , 0 , 2 , 0 , 0 , ''                       , '07 Project Gutemberg' ],
    ['source08'        , 'source08'           , sourceLogo08   , 0 , 2 , 0 , 0 , ''                       , '08 Qiuwen Baike' ],
    ['source09'        , 'source09'           , sourceLogo09   , 0 , 2 , 0 , 0 , ''                       , '09 Scholarpedia' ],
    ['source10'        , 'source10'           , sourceLogo10   , 0 , 2 , 0 , 0 , ''                       , '10 Unesco' ],
    ['source11'        , 'source11'           , sourceLogo11   , 0 , 3 , 0 , 0 , ''                       , '11 Wikipedia' ],
    ['source12'        , 'source12'           , sourceLogo12   , 0 , 2 , 0 , 0 , ''                       , '12 World History' ],

/*
['science'    , cat_science       , UICatScience   ,   ,   , 0 , 0 ,               ]
['power'      , cat_power         , UICatPower     ,   ,   , 0 , 0 ,                 ]
['culture'    , cat_culture       , UICatCulture   ,   ,   , 0 , 0 ,               ]
['trade'      , cat_trade         , UICatTrade     ,   ,   , 0 , 0 ,                 ]
['soul'       , cat_soul          , UICatSoul      ,   ,   , 0 , 0 ,                  ]
[''           , ''                ,                ,   ,   , 0 , 0 , 'setInfopanelShow'   , ''],
*/
  ];

// parse the array and determine what button corresponds to "call"
  const buttonDetails: any = ButtonsList.find((button) => button[0] === call);
  if (!buttonDetails) {return <div>Error: No button configuration found for call "{call}"</div>;}
  const [caption , tooltip, image, txtstyle, imgstyle, alignV, alignH, functionName, parameter] = buttonDetails;

// if tooltip is undefined then tooltip = caption
  const fTooltip = tooltip || caption;

// V describes where the TOOLTIP is positionned if isVertical
// H describes where the TOOLTIP is positionned if !isVertical
// 0=no tooltip, 1 to 9 is the position as on a phone keyboard (1 = aboveleft, 5 = center, 9 = belowright)
  const alignments = ['', 'al', 'ac', 'ar', 'r', 'c', 'l', 'bl', 'bc', 'br'];
  const alignmentV = alignments[alignV];
  const alignmentH = alignments[alignH];

// txt is the className for the text
  const btnClass = `toolbar_btn tooltip ${isVertical ? alignmentH : alignmentV}`;
  const classTxt = [
    btnClass,
    'debug_buttons active',
  ][txtstyle];

// img is the className for the image
  const classImg = [
    'toolbar_icons',
    'flag-icon',
    'sourcecontent',
    'sourcecontentselected',
    'sourcecontentinfopanelnavbar',
  ][imgstyle];

// functionName & parameter
  const handleClick = () => {
    switch (functionName) {
    case 'ToggleTimeview1':        setTv1Show((prev: any) => !prev)                 ;break; // show/hide Timeview1
    case 'ToggleTimeview2':        setTv2Show((prev: any) => !prev)                 ;break; // show/hide Timeview2
    case 'TogglePixiDisplay':      setWsPixiShow((prev: any) => !prev)              ;break; // show/hide pixi
    case 'ToggleWikiBtnsShow':     setWikiBtnsShow((prev: any) => !prev)            ;break; // show/hide workspace debug buttons
    case 'ToggleWikiDatesShow':    setWikiDatesShow((prev: any) => !prev)           ;break; // show/hide WikiDataTable
    case 'ToggleWsBackground':     setWsBackgd((prev: any) => (prev + 1) % 4)       ;break; // change workspace background
    case 'setInfopanelShow':       setInfopanelShow(parameter)                 ;break; // change infopanelShow (what's displayed in infopanel)
    case 'TogglequeryBoxShow':     setQueryBoxShow((prev: any) => !prev)            ;break; // change infopanelShow (what's displayed in infopanel)
    case 'handleWikiLayoutChange': handleWikiLayoutChange()                    ;break; // change wikipedia page layout (wikipedia classic/txt/pic)
    case 'handleWikiNameChange':   handleWikiNameChange(parameter)             ;break; // change url of wikipedia page
    case 'transpose':              setIsVertical(!isVertical)                  ;break; // change orientation
    case 'changeLanguage':         changeLanguage(parameter)                   ;break; // change language
    case 'openWikiNewTab':         window.open(linkUrl, '_blank')              ;break; // open wikipage in a new tab

    default:console.warn(`Function "${functionName}" is not defined.`);
    }
  };

  return (
    <div>
      <button dtooltip={loc(fTooltip)} className={classTxt} onClick={handleClick}>
        {/* if image is undefined then display caption */}
        {image ? <img alt={loc(fTooltip)} className={classImg} src={image}  /> : caption}
      </button>
    </div>
  );
};

export default ButtonsList;
