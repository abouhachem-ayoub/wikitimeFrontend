import { useEffect, useState, useContext } from 'react';
import { ContextApp } from "../../../contexts/ContextApp";
import { version } from '../../../config/version';
import { useTranslation } from 'react-i18next'; // localization
import ButtonsList from './ButtonsList';

const Toolbar: React.FC = () => {
  const {
    isVertical,
    isDragging, setIsDragging,
    splitH, setSplitH, maxSplitH,
    splitV, setSplitV, maxSplitV,
    canvasRef,
  } = useContext(ContextApp);

  //#region handleMouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'IMG') {
      e.preventDefault();
      const initialPosition = isVertical ? e.clientY : e.clientX;
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentPosition = isVertical ? moveEvent.clientY : moveEvent.clientX;
        if (Math.abs(currentPosition - initialPosition) > 5) {
          setIsDragging(true);
          document.removeEventListener('mousemove', handleMouseMove);
        }
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => { document.removeEventListener('mousemove', handleMouseMove); }, { once: true });
    }
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target instanceof HTMLElement && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'IMG') {
      e.preventDefault();
      const initialPosition = isVertical ? e.touches[0].clientY : e.touches[0].clientX;
      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentPosition = isVertical ? moveEvent.touches[0].clientY : moveEvent.touches[0].clientX;
        if (Math.abs(currentPosition - initialPosition) > 5) { setIsDragging(true); document.removeEventListener('touchmove', handleTouchMove); }
      };
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', () => { document.removeEventListener('touchmove', handleTouchMove); }, { once: true });
    }
  };

  const handleMouseUp = () => { setIsDragging(false); };
  const handleTouchEnd = () => { setIsDragging(false); };

  const updatePosition = (clientX: number, clientY: number) => {
    if (isDragging && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newPosition = isVertical
        ? ((clientY - canvasRect.top) / canvasRect.height) * 100
        : ((clientX - canvasRect.left) / canvasRect.width) * 100;
      if (isVertical) {
        setSplitV(Math.min(Math.max(newPosition, 0), maxSplitV));
      } else {
        setSplitH(Math.min(Math.max(newPosition, 0), maxSplitH));
      }
      console.log('splitV:', splitV.toFixed(0), 'splitH:', splitH.toFixed(0), 'newPosition:', newPosition.toFixed(0));
    }
  };
  const handleMouseMove = (e: MouseEvent) => { updatePosition(e.clientX, e.clientY); };
  const handleTouchMove = (e: TouchEvent) => { updatePosition(e.touches[0].clientX, e.touches[0].clientY); };

  useEffect(() => { // add and clean up listeners for mouse/touch dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  //#endregion handleMouse

  return (
    <div
      className={`toolbar ${isVertical ? 'toolbarH' : 'toolbarV'}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className='toolbar_btn_container'>
        <ButtonsList call='search' />
      </div>

      <div className='toolbar_btn_container'>
        {/* display in workspace */}
        {/* change timepaneljsons */}
        <ButtonsList call='wikibtns_show' />
        <ButtonsList call='wikidates_show' />
        <ButtonsList call='timeview1_show' />
        <ButtonsList call='timeview2_show' />
        <ButtonsList call='pixi_show' />
        <ButtonsList call='cosmos' />
        <p>---</p>
        {/* display in infopanel */}
        <ButtonsList call='account' />
        <ButtonsList call='wikipage' />  {/* wikipedia page */}
        <ButtonsList call='timepanel' /> {/* timepanel */}
        {/* timeview1sheet on/off */}
        {/* timeview2sheet on/off */}
        <ButtonsList call='catalogs' />
        <ButtonsList call='load' />
        <ButtonsList call='database' />
        <ButtonsList call='source_possible' />
        <ButtonsList call='settings' /> {/* Settings */}
      </div>

      <div className='toolbar_btn_container'>
        <ButtonsList call='trello' />
        <ButtonsList call='transpose' /> {/* Toggle vertical/horizontal */}
        {/* <div className="version">{loc('version')}</div>*/}
        <div className="version">{version}</div> {/* Version number */}
      </div>
    </div>
  );
};

export default Toolbar;
