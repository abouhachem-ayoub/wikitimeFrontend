import { createContext, useState, ReactNode } from "react";

// Create the context
export const ContextWikipedia = createContext<any>(null);

// Create a provider component
interface WikipediaProviderProps {
  children: ReactNode;
}

export const WikipediaProvider: React.FC<WikipediaProviderProps> = ({ children }) => {
  const Lang = "en"; // Language of the wikipedia pages
  const Platform = ""; // Platform of the wikipedia pages "" for pc, ".m" for mobile
  const urlWikipedia = "https://" + Lang + Platform + ".wikipedia.org";
  const [wikiUrl, setWikiUrl] = useState<string>(""); // URL of the current wiki page
  const handleWikiNameChange = (name: string) => {
    setWikiUrl(urlWikipedia + "/wiki/" + name);
  };
  const [linkUrl, setLinkUrl] = useState<string>(wikiUrl); // check diff with wikiUrl ?

  const [currentWikipediaPageName, setCurrentWikipediaPageName] = useState<string>(""); // Title of the current wiki page AEFF to rename as wikiTitle
  const [currentWikipediaPageTitle, setCurrentWikipediaPageTitle] = useState<string>(""); // Title of the current wiki page AEFF to rename as wikiTitle
  const [currentWikipediaPageDateStart, setCurrentWikipediaPageDateStart] = useState<string>(""); // Title of the current wiki page AEFF to rename as wikiTitle
  const [currentWikipediaPageDateEnd, setCurrentWikipediaPageDateEnd] = useState<string>(""); // Title of the current wiki page AEFF to rename as wikiTitle
  const [currentWikipediaPageWdId, setCurrentWikipediaPageWdId] = useState<string>(""); // Title of the current wiki page AEFF to rename as wikiTitle
  const [imageContent, setImageContent] = useState<string>(""); // Image content of the current wiki page AEFF to rename as wikiImage
  const [bodyContent, setBodyContent] = useState<string>(""); // Body content of the current wiki page AEFF to rename as wikiBody
  const [wikiLayoutIndex, setWikiLayoutIndex] = useState<number>(1); // Layout index of the wikipedia pages (1= text/pic 2= pic/text 3=wikipedia)
  const handleWikiLayoutChange = () => {
    setWikiLayoutIndex((wikiLayoutIndex + 1) % 3);
  };

  const [historyUrlList, setHistoryUrlList] = useState<string[]>([wikiUrl]); // Navigation historyUrlList AEFF to rename as wikihistoryUrlList
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(0);
  const moveHistoryIndexBack = () => {
    if (currentHistoryIndex > 0) {
      const prevHistoryIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(prevHistoryIndex);
      setLinkUrl(historyUrlList[prevHistoryIndex]);
      setBackLimit(prevHistoryIndex === 0);
      setForwardLimit(false);
    }
  };
  const moveHistoryIndexForward = () => {
    if (currentHistoryIndex < historyUrlList.length - 1) {
      const nextHistoryIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(nextHistoryIndex);
      setLinkUrl(historyUrlList[nextHistoryIndex]);
      setForwardLimit(nextHistoryIndex === historyUrlList.length - 1);
      setBackLimit(false);
    }
  };

  const [isImage, setIsImage] = useState<boolean>(false); // Is the current page an image? AEFF to rename as wikiIsImage
  const [backLimit, setBackLimit] = useState<boolean>(true); // limit to go back in history
  const [forwardLimit, setForwardLimit] = useState<boolean>(true); // limit to go forward in history

  const [queryBoxShow, setQueryBoxShow] = useState<boolean>(false); // show QueryBox or not
  const [searchResults, setSearchResults] = useState<any[]>([]); // list of Search results
  const [wikiDatesShow, setWikiDatesShow] = useState<boolean>(false); // show wikiDatesTable or not
  const [wikiDatesData, setWikiDatesData] = useState<any[]>([]); // Data for the wikiDatesTable

  return (
    <ContextWikipedia.Provider
      value={{
        urlWikipedia,
        linkUrl,
        setLinkUrl,
        wikiUrl,
        setWikiUrl,
        handleWikiNameChange,

        currentWikipediaPageName,
        setCurrentWikipediaPageName,
        currentWikipediaPageTitle,
        setCurrentWikipediaPageTitle,
        currentWikipediaPageDateStart,
        setCurrentWikipediaPageDateStart,
        currentWikipediaPageDateEnd,
        setCurrentWikipediaPageDateEnd,
        currentWikipediaPageWdId,
        setCurrentWikipediaPageWdId,

        imageContent,
        setImageContent,
        bodyContent,
        setBodyContent,
        wikiLayoutIndex,
        setWikiLayoutIndex,
        historyUrlList,
        setHistoryUrlList,
        currentHistoryIndex,
        setCurrentHistoryIndex,
        isImage,
        setIsImage,
        backLimit,
        setBackLimit,
        forwardLimit,
        setForwardLimit,
        moveHistoryIndexBack,
        moveHistoryIndexForward,
        handleWikiLayoutChange,

        queryBoxShow,
        setQueryBoxShow,
        searchResults,
        setSearchResults,
        wikiDatesShow,
        setWikiDatesShow,
        wikiDatesData,
        setWikiDatesData,
      }}
    >
      {children}
    </ContextWikipedia.Provider>
  );
};