// isShiftPressed
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event) => {if (event.shiftKey) {setIsShiftPressed(true);}}; const handleKeyUp = (event) => {if (!event.shiftKey) {setIsShiftPressed(false);}};
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    return () => {window.removeEventListener('keydown', handleKeyDown);window.removeEventListener('keyup', handleKeyUp);};
  }, []);
  
  return (
    <>
      {isShiftPressed ? (<p>You pressed shift</p>) : (<p>You did not press shift</p>)}
    </>
  );
// isShiftPressed


// localizations
  import { useTranslation } from 'react-i18next'; //localization
  const { t: loc } = useTranslation();
  <p>{loc('test')}</p>
// localizations