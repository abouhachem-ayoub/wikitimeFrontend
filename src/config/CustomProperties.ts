export function setCustomProperty(property: string, value: string): void {
  document.documentElement.style.setProperty(property, value);
}

export function initializeCustomProperties(): void {
  // this is already in custom-properties.scss
  // I keep it in case I need to dynamically adjust values
  // for instance change colors in settings...
  /*
  //Workspace WS
  setCustomProperty('--color-WSbackground', '#D9D9D9');
  setCustomProperty('--color-WSbackgrounddark', '#BFBFBF');
  setCustomProperty('--color-timeviewButtonBorder', 'black');

  //Toolbar TB
  setCustomProperty('--color-TBBackground', '#989898');
  setCustomProperty('--color-TBText', '#FFF');
  setCustomProperty('--filter-TBLightBlue','invert(27%) sepia(100%) saturate(7471%) hue-rotate(190deg) brightness(254%) contrast(107%)');
  setCustomProperty('--value-TBSize: 30px');
  setCustomProperty('--value-TBBtnSize: 20px');
  
  //InfoPanel IP
  setCustomProperty('--value-IPNavbarSize: 40px');
  setCustomProperty('--color-IPbackground', '#D9D9D9');
  setCustomProperty('--color-IPButton: #494949');
  setCustomProperty('--color-IPButtonHover: #492626');
  setCustomProperty('--color-IPButtonActive: #ad0404');
  setCustomProperty('--color-IPButtonText: #ffffff');
*/
} 
