import { useState, useContext } from 'react';
import { ContextApp } from "../../../contexts/ContextApp";
import ButtonsList from '../../Infopanel/Toolbar/ButtonsList';

const WikiButtons: React.FC = () => {
  const { wikiBtnsShow } = useContext(ContextApp);

  return (
    wikiBtnsShow && (
      <div className="debug_container">
        <ButtonsList call='Sun' />
        <ButtonsList call='Plato' />
        <ButtonsList call='Einstein' />
        <ButtonsList call='Sapiens' />
        <ButtonsList call='Universe' />
        <ButtonsList call='van Gogh' />
        <ButtonsList call='Bonger' />
        <ButtonsList call='Theo' />
        <ButtonsList call='GMM' />
        <ButtonsList call='Dumas' />
        <ButtonsList call='Goupil' />
        <ButtonsList call='FurtherReading' />
        <ButtonsList call='ExternalLink' />
        <ButtonsList call='Publications' />
        <ButtonsList call='Awards' />
      </div>
    )
  );
};

export default WikiButtons;
