import { useEffect, useRef, useState, useContext } from 'react';
import { ContextWikipedia } from "../src/contexts/ContextWikipedia";
import '../../styles/infopanel.scss';
import parse from 'html-react-parser';
import WikipediaNavbar from '../src/components/Infopanel/SourceContent/SourceContentNavbar';

const Wikipedia = () => {
  const {
    urlWikipedia,
    wikiUrl,
    linkUrl,         setLinkUrl,

    wikiDatesData,        setWikiDatesData,
    handleWikiDatesData,

    title,           setTitle,
    imageContent,    setImageContent,
    bodyContent,     setBodyContent,
    wikiLayoutIndex,     setWikiLayoutIndex,
    isWikiLoading,   setIsWikiLoading,

    historyURLList,         setHistoryURLList,
    currentHistoryIndex,    setCurrentHistoryIndex,

    isImage,         setIsImage,
    backLimit,       setBackLimit,
    forwardLimit,    setForwardLimit,
  } = useContext(ContextWikipedia);

  useEffect(() => { // when linkUrl changes, fetchWikipediaContent
    fetchWikipediaContent(linkUrl);
  }, [linkUrl]);

  useEffect(() => { // when wikiUrl changes, update historyURLList and currentHistoryIndex
    if (wikiUrl !== linkUrl) {
      setHistoryURLList((prev) => [...prev.slice(0, currentHistoryIndex + 1), wikiUrl]);
      setCurrentHistoryIndex((prev) => prev + 1);
      setLinkUrl(wikiUrl);

      // Reset navigation limits
      setBackLimit(false);
      setForwardLimit(true);
    }
  }, [wikiUrl]);

  const fetchWikipediaContent = async (url) => { // performance HUUUGE over 7000ms
    const startFetchWikipediaContent = performance.now(); //TODOlater Start time
    setIsWikiLoading(true);
    const wpAPIcall = '/w/api.php?action=parse&page=';
    const pageTitle = decodeURIComponent(url.split('/').pop());
    const wpAPIparams = '&prop=text|images&format=json&origin=*';
    const wpUrl = `${urlWikipedia}${wpAPIcall}${pageTitle}${wpAPIparams}`;

    // AEFFFETCH
    const response = await fetch(wpUrl);
    const data = await response.json();

    if (data.parse) {
      setTitle(data.parse.title);
      const rawHtml = data.parse.text['*'];
      setImageContent(extractImages(rawHtml));
      setBodyContent(cleanContent(rawHtml));

      // Extract the date range and page name
      const wikiDatesData = await extractDates(rawHtml);
      handleWikiDatesData(wikiDatesData);
    }

    setIsWikiLoading(false);
    console.log(`2- ${(performance.now() - startFetchWikipediaContent).toFixed(0)}ms fetchWikipediaContent`); //TODOlater
  };

  const extractDates = async (html) => { // performance HUUUGE over 7000ms
    const startExtractDates = performance.now(); //TODOlater Start time
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const url = new URL(linkUrl);
    const name = decodeURIComponent(url.pathname.split('/').pop());

    const parseDate = (text) => {
      const datePatterns = [
        /(\d{1,2} \w+ \d{4})/, // e.g., "4 January 1643"
        /(\w+ \d{1,2}, \d{4})/, // e.g., "February 12, 1809"
        /(\d{1,2} \w+ \d{1,4} BC)/,
        /(\d{1,4})\/(\d{1,4})\s+or\s+(\d{1,4})\/(\d{1,4})\s?BC/,
        /(\d{1,4} (BC|BBY|AD|BCE|CE))/,
        /(\d{4})/
      ];

      for (const pattern of datePatterns) {
        const match = text.replace(/\u00A0/g, ' ').match(pattern);
        if (match) return match[0];
      }
      return '';
    };

    const findDateFromText = (text) => {
      const match = text
        .replace(/\u00A0/g, ' ')
        .trim()
        .match(/(\d{1,2} \w+ \d{4}|\d{1,2} \w+|\w+ \d{1,2}, \d{4})\s?.*?\s?(\d{1,2} \w+ \d{4}|\d{1,2} \w+|\w+ \d{1,2}, \d{4})/);
      return match ? { ibStart: match[1], ibEnd: match[2] } : { ibStart: parseDate(text), ibEnd: '' };
    };

    const extractDatesFromTable = (table) => {
      const thElements = table?.querySelectorAll('th');
      let ibStartDate = '', ibEndDate = '';

      const setDates = (thText, regex) => {
        thElements?.forEach((th) => {
          if (th.textContent.includes(thText)) {
            const td =
              thText === 'Independence'
                ? th.parentElement?.nextElementSibling?.nextElementSibling.querySelector(
                    'td'
                  )
                : th.nextElementSibling;
            if (td) {
              const dateText = td.textContent.trim();
              const { ibStart, ibEnd } = regex(dateText);
              ibStartDate = ibStart || ibStartDate;
              ibEndDate = ibEnd || ibEndDate;
            }
          }
        });
      };

      // Main date-related sections
      setDates('Date', (text) => findDateFromText(text));
      setDates('Effective', (text) => ({ibStart: parseDate(text),ibEnd: ''}));
      setDates('Born', (text) => ({ ibStart: parseDate(text), ibEnd: '' }));
      setDates('Died', (text) => ({ ibStart: '', ibEnd: parseDate(text) }));
      setDates('Publication date', (text) => ({ibStart: parseDate(text),ibEnd: ''}));
      setDates('Release', (text) => findDateFromText(text));
      setDates('Founded', (text) => ({ ibStart: parseDate(text), ibEnd: '' }));
      setDates('Independence', (text) => ({ibStart: parseDate(text),ibEnd: ''}));
      setDates('Established', (text) => ({ibStart: parseDate(text),ibEnd: ''}));
      setDates('Launch date', (text) => ({ibStart: parseDate(text),ibEnd: ''}));
      setDates('Landing date', (text) => ({ibStart: '',ibEnd: parseDate(text)}));

      return { ibStart: ibStartDate, ibEnd: ibEndDate };
    };

    // Fetch Wikidata dates
    //TODOnow improve = not sure... maybe batch requests (possible?) and do the process after fetch?
    const fetchWikidataDates = async (wdId) => { // performance 158-487ms
    const startFetchWikidataDates = performance.now(); //TODOlater Start time
      try {
        const response = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wdId}.json`);
        if (!response.ok) throw new Error('Failed to fetch Wikidata');

        const data = await response.json();
        const entity = data.entities[wdId];

        const birthDate =entity?.claims?.P569?.[0]?.mainsnak?.datavalue?.value?.time || '';
        const deathDate =entity?.claims?.P570?.[0]?.mainsnak?.datavalue?.value?.time || '';
        if (birthDate) {return {wdStart: birthDate,wdEnd: deathDate}}

        const startTime =entity?.claims?.P580?.[0]?.mainsnak?.datavalue?.value?.time || '';
        const endTime =entity?.claims?.P582?.[0]?.mainsnak?.datavalue?.value?.time || '';
        if (startTime) {return {wdStart: startTime,wdEnd: endTime}}

        const effectiveTime =entity?.claims?.P7588?.[0]?.mainsnak?.datavalue?.value?.time || '';
        if (effectiveTime) {return {wdStart: effectiveTime,wdEnd: ''}}

        const publicationDate =entity?.claims?.P577?.[0]?.mainsnak?.datavalue?.value?.time || '';
        if (publicationDate) {return {wdStart: publicationDate,wdEnd: ''}}

        const inceptionDate =entity?.claims?.P571?.[0]?.mainsnak?.datavalue?.value?.time || '';
        if (inceptionDate) {return {wdStart: inceptionDate,wdEnd: ''}}

        const pointTime =entity?.claims?.P585?.[0]?.mainsnak?.datavalue?.value?.time || '';
        if (pointTime) {return {wdStart: pointTime,wdEnd: ''}}

        const launchTime =entity?.claims?.P619?.[0]?.mainsnak?.datavalue?.value?.time || '';
        const landingTime =entity?.claims?.P620?.[0]?.mainsnak?.datavalue?.value?.time || '';
        if (launchTime) {return {wdStart: launchTime,wdEnd: landingTime}}

    console.log(`0.1- ${(performance.now() - startFetchWikidataDates).toFixed(0)}ms FetchWikidataDates`); //TODOlater
        return {wdStart: '',wdEnd: ''};
      } catch (error) {
        console.error('Error fetching Wikidata:', error);
        return { wdStart: '', wdEnd: '' };
      }
    };

    //fetch wikidataID (AEFF Fetch)
    //TODOnow improve = batching all the wikipedia API in a single request
/*
    const getWikidataIDs = async (titles) => {
      const titlesParam = titles.join('|');
      const wikidataUrl = `${urlWikipedia}/w/api.php?action=query&prop=pageprops&titles=${titlesParam}&format=json&origin=*`;
    
      try {
        const response = await fetch(wikidataUrl);
        if (response.ok) {
          const data = await response.json();
          const pages = data.query.pages;
          const wikidataIDs = Object.values(pages).map(page => page.pageprops?.['wikibase_item'] || null);
          return wikidataIDs;
        } else {
          console.error('Error fetching Wikidata IDs:', response.statusText);
          return [];
        }
      } catch (error) {
        console.error('Error fetching Wikidata IDs:', error);
        return [];
      }
    };

// Example usage
const titles = ['Albert_Einstein', 'Isaac_Newton', 'Marie_Curie'];
getWikidataIDs(titles).then(wikidataIDs => {console.log(wikidataIDs)}); // Array of Wikidata IDs
*/
    const getWikidataID = async (title) => { // performance 118-154ms
      const startFetchWikidataID = performance.now(); //TODOlater Start time
      const wikidataUrl = urlWikipedia + '/w/api.php?action=query&prop=pageprops&titles=' + title + '&format=json&origin=*';
      const response = await fetch(wikidataUrl);
      if (response.ok) {
        const data = await response.json();
        const pages = data.query.pages;
        const page = Object.values(pages)[0]; // We expect one result per title
        if (page && page.pageprops && page.pageprops['wikibase_item']) {return page.pageprops['wikibase_item']} // Return Wikidata ID
    console.log(`0.2- ${(performance.now() - startFetchWikidataID).toFixed(0)}ms FetchWikidataID`); //TODOlater
      }
    };

    const extractLinksAndWikidata = async (rawHtml) => { // performance HUUUGE over 7000ms
      const startExtractLinksAndWikidata = performance.now(); //TODOlater Start time
      // Create a DOM parser to parse the raw HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');

      // Find the last <p> element in the document
      const lastParagraph = doc.querySelectorAll('p');
      const lastParagraphElement = lastParagraph[lastParagraph.length - 1];

      // Get the HTML content from the start of rawHtml up to the last <p> element
      const removedIAL = rawHtml.slice(0, rawHtml.indexOf(lastParagraphElement.outerHTML) + lastParagraphElement.outerHTML.length);

      // Parse the extracted content
      const doc1 = new DOMParser().parseFromString(removedIAL, 'text/html');
      const links = doc1.querySelectorAll(
        'a[href*="/wiki/"][href*="_"], a[href*="/wiki/"][href*="-"], a[href*="/wiki/"][href*="%"], a[href*="/wiki/"][href*="0"], a[href*="/wiki/"][href*="1"], a[href*="/wiki/"][href*="2"], a[href*="/wiki/"][href*="3"], a[href*="/wiki/"][href*="4"], a[href*="/wiki/"][href*="5"], a[href*="/wiki/"][href*="6"], a[href*="/wiki/"][href*="7"], a[href*="/wiki/"][href*="8"], a[href*="/wiki/"][href*="9"], a[href*="/wiki/"][href*="a"], a[href*="/wiki/"][href*="b"], a[href*="/wiki/"][href*="c"], a[href*="/wiki/"][href*="d"], a[href*="/wiki/"][href*="e"], a[href*="/wiki/"][href*="f"], a[href*="/wiki/"][href*="g"], a[href*="/wiki/"][href*="h"], a[href*="/wiki/"][href*="i"], a[href*="/wiki/"][href*="j"], a[href*="/wiki/"][href*="k"], a[href*="/wiki/"][href*="l"], a[href*="/wiki/"][href*="m"], a[href*="/wiki/"][href*="n"], a[href*="/wiki/"][href*="o"], a[href*="/wiki/"][href*="p"], a[href*="/wiki/"][href*="q"], a[href*="/wiki/"][href*="r"], a[href*="/wiki/"][href*="s"], a[href*="/wiki/"][href*="t"], a[href*="/wiki/"][href*="u"], a[href*="/wiki/"][href*="v"], a[href*="/wiki/"][href*="w"], a[href*="/wiki/"][href*="x"], a[href*="/wiki/"][href*="y"], a[href*="/wiki/"][href*="z"]'
      );

      const infoTime = [];

      // performance HUUUGE over 7000ms
      // Loop through each link, get the title, and fetch its Wikidata ID
      const startParseAllLinks = performance.now(); //TODOlater Start time
      for (let link of links) {
        const href = link.getAttribute('href');
        const title = href.split('/wiki/')[1]; // Extract title from the href
        if (title) {
          const wikidataId = await getWikidataID(title);
          if (wikidataId) {
            const wikidataDates = await fetchWikidataDates(wikidataId);
            infoTime.push({
              name: title,
              wdId: wikidataId,
              wdStart: wikidataDates.wdStart,
              wdEnd: wikidataDates.wdEnd,
              ibStart: wikidataDates.wdStart, //TODOnow NO!!!
              ibEnd: wikidataDates.wdEnd, //TODOnow NO!!!
            });
          }
        }
      }
      console.log(`0.3.3- ${(performance.now() - startParseAllLinks).toFixed(0)}ms ParseAllLinks`); //TODOlater

      console.log(`0.3- ${(performance.now() - startExtractLinksAndWikidata).toFixed(0)}ms ExtractLinksAndWikidata`); //TODOlater
      return infoTime;
    };

    const infobox = doc.querySelector('table.Infobox');
    const wikidataLink = doc.querySelectorAll('a[href^="https://www.wikidata.org/wiki/Q"][href$="#identifiers"]')[0];
    const wdId = wikidataLink ? wikidataLink.href.split('/').pop().split('#')[0].split('?')[0] : null;
    const { ibStart, ibEnd } = extractDatesFromTable(infobox);

    let wdStart = '', wdEnd = '';

    if (wdId) {
      const wikidataDates = await fetchWikidataDates(wdId);
      wdStart = wikidataDates.wdStart; wdEnd = wikidataDates.wdEnd;
    }

    const currentWikiDatesData = { name, wdId, wdStart, wdEnd, ibStart, ibEnd };
    const linkedWikiDatesData = await extractLinksAndWikidata(cleanContent(html));

    console.log(`0- ${(performance.now() - startExtractDates).toFixed(0)}ms extractDates`); //TODOlater
    return [currentWikiDatesData, ...linkedWikiDatesData];
  };

  const cleanContent = (html) => { // performance 2-41ms
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Update all <a> href attributes to point to the actual Wikipedia domain
    doc.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        link.setAttribute('href', `${urlWikipedia}${href}`);
      }
    });

    const unwantedSelectors = [
      'div[role="note"].hatnote.navigation-not-searchable',
      'div[role="navigation"].navbox',
      'div.thumb.tmulti.tright',
      'div.thumb.tmulti.tnone.center',
      'div.thumb.tnone',
      'span.mw-editsection',
      'figure',
      'table',
      'ul.gallery'
    ];

    unwantedSelectors.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element); // Ensure parent exists
        }
      });
    });

    // Remove content between headings or sections
    const headingsToRemoveFrom = ['Notes', 'Footnotes', 'References'];
    let div1 = null;

    for (const heading of headingsToRemoveFrom) {
      const headingElement = doc.querySelector(`.mw-heading h2#${heading}`);
      if (headingElement) {
        div1 = headingElement.parentElement;
        break;
      }
    }

    const div2 = doc.querySelector('.navbox.authority-control');

    if (div1 && div2) {
      let currentNode = div1.nextElementSibling;
      div1.remove();

      while (currentNode && currentNode !== div2) {
        const nextNode = currentNode.nextElementSibling;
        currentNode.remove();
        currentNode = nextNode;
      }

      div2.remove();
    }

    return doc.body.innerHTML;
  };

  const extractImages = (html) => { // performance 2-43ms
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Update all <a> href attributes to point to the actual Wikipedia domain
    doc.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        link.setAttribute('href', `${urlWikipedia}${href}`);
      }
    });

    const contentContainer = document.createElement('div');
    const imageSelectors = [
      '.thumb.tmulti.tright .thumbinner.multiimageinner .trow',
      '.thumb.tnone',
      'figure',
      '.gallerybox'
    ];

    imageSelectors.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((element) => {
        element.style.width = 'min-content';
        element.style.border = '1px solid var(--border-color-subtle, #c8ccd1)';
        element.style.background =
          'var(--background-color-interactive-subtle, #f8f9fa)';
        contentContainer.appendChild(element.cloneNode(true));
      });
    });
    return contentContainer.innerHTML;
  };

  const handleLinkClick = (event) => { // performance 0ms
    event.preventDefault();

    let target = event.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }

    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href');
      if (href && !href.startsWith('#')) {
        //check if image link
        const hasImage = target.querySelector('img') !== null;

        if (hasImage) {
          setWikiLayoutIndex(0); // Switch to iframe layout
          setIsImage(true);
        }

        setHistoryURLList((prev) => [...prev.slice(0, currentHistoryIndex + 1), href]);
        setCurrentHistoryIndex((prev) => prev + 1);
        setIsWikiLoading(true);
        setLinkUrl(href);
        setBackLimit(false);
        setForwardLimit(true);
      }
    }
  };

  const renderContent = () => { // performance 0-111ms
    const contentOrder = {
      1: (<>
          <div className="wikipedia-title">{title}</div>
          <div className="text-content">{parse(bodyContent)}</div>
          <div className="image-content">{parse(imageContent)}</div>
        </>),
      2: (<>
          <div className="wikipedia-title">{title}</div>
          <div className="image-content">{parse(imageContent)}</div>
          <div className="text-content">{parse(bodyContent)}</div>
        </>)
    };

    return contentOrder[wikiLayoutIndex] || null;
  };

  //Responsive by resize
  useEffect(() => {
    const infopanel = document.querySelector('.wikipedia');
    const articleContent = document.querySelector('.article-content');

    const adjustVerticalSize = () => {
      if (infopanel && articleContent) {
        if (infopanel.offsetWidth < 400) {
          articleContent.style.padding = '0 0.8rem 0 0.8rem';
          document.querySelectorAll('p').forEach((element) => {
            element.style.marginBottom = '0px';
          });
        } else {
          articleContent.style.padding = '';
          document.querySelectorAll('p').forEach((element) => {
            element.style.marginBottom = '';
          });
        }
      }
    };

    // Initialize ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      adjustVerticalSize();
    });
    if (infopanel) {
      resizeObserver.observe(infopanel);
    }
    // Initial adjustment
    adjustVerticalSize();
    // Cleanup on unmount
    return () => {
      if (infopanel) {
        resizeObserver.unobserve(infopanel);
      }
    };
  }, []);

  return (
    <div className="wikipedia">

      <WikipediaNavbar />

      {/* wikiLayoutIndex 0=wikipedia page | 1=text | 2=pics */}
      {wikiLayoutIndex === 0 ? (
        <iframe
          src={linkUrl}
          className="iframe_content"
          onLoad={() => setIsWikiLoading(false)}
        />
      ) : (
        <div
          className="article-content"
          onClick={handleLinkClick}
          onLoad={() => setIsWikiLoading(false)}
        >
          {renderContent()}
        </div>
      )}

      {isWikiLoading && <div className="wikiLoading-bar active"></div>}

    </div>
  );
};

export default Wikipedia;
