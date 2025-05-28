import { createContext, useEffect, useState, ReactNode } from "react";

export const ContextTimeLine = createContext<any>(null);

interface TimeLineProviderProps {
  children: ReactNode;
}

export const TimeLineProvider: React.FC<TimeLineProviderProps> = ({ children }) => {
  const [pastBarHeight, setPastBarHeight] = useState<number>(50); // pastBar height 40-200
  // #region timeMarks
  const [pastBarTop, setPastBarTop] = useState<number>(0); // pastBar start y position
  const [pastBarBottom, setPastBarBottom] = useState<number>(50);

  const [tMIconSize, setTMIconSize] = useState<number>(30);
  const [tMIconY, setTMIconY] = useState<number>(18);

  const [tMTextY, setTMTextY] = useState<number>(43);
  const [tMTextFontSize, setTMTextFontSize] = useState<number>(15);

  const [tMStampWidth, setTMStampWidth] = useState<number>(4); // Stamp width
  const [tMStampHeight, setTMStampHeight] = useState<number>(4); // Stamp height
  const [tMStampStartX, setTMStampStartX] = useState<number>(-2);

  const [tMDateY, setTMDateY] = useState<number>(55);
  const [tMDateFontSize, setTMDateFontSize] = useState<number>(10);

  useEffect(() => {
    setTMStampStartX(-Math.round(tMStampWidth / 2));
  }, [tMStampWidth]);

  useEffect(() => {
    // Whenever pastBarTop or pastBarHeight change, recalc all derived values:
    setPastBarBottom(pastBarTop + pastBarHeight); // pastBar bottom y position
    setTMIconSize(Math.round(pastBarHeight * 0.65)); // Icon size in % of pastBar height
    setTMIconY(Math.round(pastBarHeight * 0.35)); // Icon y position in % of pastBar height
    setTMTextY(Math.round(pastBarHeight * 0.85)); // Text y position in % of pastBar height
    setTMTextFontSize(Math.round(pastBarHeight * 0.3)); // Text font size in % of pastBar height
    setTMStampWidth(Math.round(pastBarHeight * 0.08)); // Stamp height in % of pastBar height
    setTMStampHeight(Math.round(pastBarHeight * 0.08)); // Stamp height in % of pastBar height
    setTMDateFontSize(Math.round(pastBarHeight * 0.2)); // Date font size in % of pastBar height
    setTMDateY(
      pastBarTop +
        pastBarHeight +
        Math.round(pastBarHeight * 0.08) +
        Math.round((pastBarHeight * 0.2) / 2),
    ); // Date y position in % of pastBar height
  }, [pastBarTop, pastBarHeight]);

  // #endregion timeMarks

  // constant vars
  const pastBarColor = 0x1099bb;

  return (
    <ContextTimeLine.Provider
      value={{
        pastBarTop,
        setPastBarTop,
        pastBarHeight,
        setPastBarHeight,
        pastBarBottom,

        tMIconSize,
        setTMIconSize,
        tMIconY,
        setTMIconY,

        tMTextY,
        setTMTextY,
        tMTextFontSize,
        setTMTextFontSize,

        tMStampHeight,
        setTMStampHeight,
        tMStampWidth,
        setTMStampWidth,
        tMStampStartX,
        setTMStampStartX,

        tMDateY,
        setTMDateY,
        tMDateFontSize,
        setTMDateFontSize,

        pastBarColor,
      }}
    >
      {children}
    </ContextTimeLine.Provider>
  );
};
