import { useEffect, useContext, useState } from "react";
import { ContextWikipedia } from "../../contexts/ContextWikipedia";
import parse from "html-react-parser";
import WikipediaNavbar from "../Infopanel/SourceContent/SourceContentNavbar";
import WikipediaResults from "./WikipediaResults";

const Wikipedia: React.FC = () => {
  const {
    urlWikipedia,
    wikiUrl,
    linkUrl,
    setLinkUrl,

    wikiDatesData,
    setWikiDatesData,

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
    setWikipediaSearchResultsAvailable,
    searchResults,
    setSearchResults,
    queryBoxShow,
    setQueryBoxShow,
  } = useContext(ContextWikipedia);

  const [linkStatuses, setLinkStatuses] = useState<{ [key: string]: string }>({});

  // When wikiUrl changes, update historyUrlList & currentHistoryIndex then linkUrl=wikiUrl
  useEffect(() => {
    if (wikiUrl !== linkUrl) {
      setHistoryUrlList((prev: any) => [...prev.slice(0, currentHistoryIndex + 1), wikiUrl]);
      setCurrentHistoryIndex((prev: any) => prev + 1);
      setLinkUrl(wikiUrl);

      // Reset navigation limits
      setBackLimit(false);
      setForwardLimit(true);
    }
  }, [wikiUrl]);

  // when linkUrl changes, fetch HTML and extract dates data from WP page
  useEffect(() => {
    const magic = async () => {
      const data = await getData(linkUrl, urlWikipedia, setCurrentWikipediaPageTitle);
      if (data && Object.keys(data).length > 0) {
        setCurrentWikipediaPageTitle(data.parse.title);
        const rawHtml = data.parse.text["*"];
        setImageContent(extractImages(urlWikipedia, rawHtml));
        const cleanHtml = cleanContent(urlWikipedia, rawHtml);
        setBodyContent(cleanHtml);

        extractCurrentWikipediaPageDatesData(
          linkUrl,
          rawHtml,
          urlWikipedia,
          currentWikipediaPageName,
          setCurrentWikipediaPageName,
          setCurrentWikipediaPageDateStart,
          setCurrentWikipediaPageDateEnd,
          setCurrentWikipediaPageWdId
        );

        const allLinks = await extractAllLinksFromCleanHtml(cleanHtml);

        // Initialize link statuses
        const initialStatuses: { [key: string]: string } = {};
        allLinks.forEach(link => {
          const href: any = link.getAttribute("href");
          initialStatuses[href] = "wp-in-progress";
        });
        setLinkStatuses(initialStatuses);

        const linkedWikipediaPagesDatesData = await extractWikidataIdsOneByOne(allLinks, urlWikipedia, setLinkStatuses);
        setWikiDatesData(linkedWikipediaPagesDatesData);
      }
    };
    magic();
  }, [linkUrl]);

  // manage historyUrlList
  const handleLinkClick = (event: React.MouseEvent) => {
    const anchor = event.target.closest("a");
    if (!anchor) return;

    event.preventDefault();
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    // Check if the link contains an image
    if (anchor.querySelector("img")) {
      setWikiLayoutIndex(0);
      setIsImage(true);
    }

    // Update history
    setHistoryUrlList((prev: any) => [...prev.slice(0, currentHistoryIndex + 1), href]);
    setCurrentHistoryIndex((prev: any) => prev + 1);
    setLinkUrl(href);
    setBackLimit(false);
    setForwardLimit(true);
  };

  // Responsive for small screen
  useEffect(() => {
    adjustForSmallInfopanel();
  }, []);

  return (
    <>
      <div className="wikipedia">
        <WikipediaNavbar />

        {queryBoxShow && <WikipediaResults />}

        {wikiLayoutIndex === 0 && <iframe src={linkUrl} className="iframe_content" />}

        <div className="article-content" onClick={handleLinkClick}>
          <div className="text-content-title">{currentWikipediaPageTitle}</div>

          {wikiLayoutIndex === 1 && (
            <div className="allow-selection">
              <div className="text-content">
                {parse(bodyContent, {
                  replace: (domNode:any) => {
                    if (domNode.name === 'a') {
                      const href = domNode.attribs.href;
                      const status = linkStatuses[href] || 'wp-in-progress';
                      return (
                        <a {...domNode.attribs} className={status}>
                          {domNode.children[0].data}
                        </a>
                      );
                    }
                  }
                })}
              </div>
              <div className="image-content">{parse(imageContent)}</div>
            </div>
          )}

          {wikiLayoutIndex === 2 && (
            <div className="allow-selection">
              <div className="image-content">{parse(imageContent)}</div>
              <div className="text-content">
                {parse(bodyContent, {
                  replace: (domNode:any) => {
                    if (domNode.name === 'a') {
                      const href = domNode.attribs.href;
                      const status = linkStatuses[href] || 'wp-in-progress';
                      return (
                        <a {...domNode.attribs} className={status}>
                          {domNode.children[0].data}
                        </a>
                      );
                    }
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wikipedia;


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Fetch the HTML content of a Wikipedia page
const getData = async (linkUrl: any, urlWikipedia: any, setCurrentWikipediaPageTitle: any) => {
  if (!linkUrl) {
    console.log("Invalid linkUrl:", linkUrl)
    return
  }

  // get the Wikipedia API Url
  const wpApiCall = "/w/api.php?action=parse&page="
  const wpApiCallId = "/w/api.php?action=parse&pageid="
  const wpApiParams = "&prop=text|images&format=json&origin=*"
  const pageName = decodeURIComponent(linkUrl.split("/").pop())
  const pageId = linkUrl.split("curid=")[1]
  const pageIdOrName = linkUrl.includes("curid=") ? pageId : pageName
  const wpApiUrl = `${urlWikipedia}${wpApiCall}${pageIdOrName}${wpApiParams}`

  const wpApiCall2 = "/api/rest_v1/page/html/"
  const wpApiUrl2 = `${urlWikipedia}${wpApiCall2}${pageName}`

  // fetch the Wikipedia content
  try {
    const response = await fetch(wpApiUrl)
    const data = await response.json()

    if (data.parse) {
      return data //success
    } else {
      const data = "Something Weird happened with" + wpApiUrl
      alert(data)
      return data
    }
  } catch (error) {
    const data = "Error fetching Wikipedia content: " + wpApiUrl
    alert(data)
    return data
  }
}
// in: Wikipedia HTML content - out: sanitized HTML without unwanted sections, infobox, reference numbers, series navigation box
const getData2 = async (text: any) => {
  // ONLY if text comes from wpApiUrl2
  // const response = await fetch(wpApiUrl2);
  // const data = await response.text();
  const doc = new DOMParser().parseFromString(text, "text/html")

  // Remove unwanted sections
  const unwantedHeadings = [
    "Notes",
    "Footnotes",
    "References",
    "Works cited",
//    "External links",
    "Publications",
    "Further reading",
  ]
  unwantedHeadings.forEach((heading) => {
    const elements = Array.from(doc.querySelectorAll("h2, h3, h4"))
    elements.forEach((el: any) => {
      if (el.innerText.trim() === heading) {
        let section = el.nextElementSibling
        while (section && !["H2", "H3"].includes(section.tagName)) {
          const next = section.nextElementSibling
          section.remove()
          section = next
        }
        el.remove()
      }
    })
  })

  // Remove infobox
  const infobox = doc.querySelector("table.infobox")
  if (infobox) {
    infobox.remove()
  }

  // Remove reference numbers (citations)
  const references = doc.querySelectorAll("sup")
  references.forEach((ref) => ref.remove())

  // Remove "This article is part of a series..."
  const seriesBoxes = doc.querySelectorAll("div")
  seriesBoxes.forEach((div) => {
    if (/This article is part of a series/i.test(div.innerText)) {
      //AEFFlocalization
      div.remove()
    }
  })

  // Remove sidebar navigation boxes
  const sidebars = doc.querySelectorAll(".navbox, .sidebar, .vertical-navbox")
  sidebars.forEach((sidebar) => sidebar.remove())

  // Sanitize HTML before inserting
  const sanitizedContent = doc.body.innerHTML.replace(/<script.*?>.*?<\/script>/gi, "")

  let content = document.getElementById("content");
  if(content) content.innerHTML =  sanitizedContent;
  else throw Error("Content doesn't exist!")

  return sanitizedContent
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// adjust padding/margin for small infopanel
const adjustForSmallInfopanel = () => {
  const infopanel: any = document.querySelector(".wikipedia")
  const articleContent: any = document.querySelector(".article-content")

  //adjust padding/margin for small infopanel
  const adjustVerticalSize = () => {
    if (infopanel && articleContent) {
      if (infopanel.offsetWidth < 400) {
        articleContent.style.padding = "0 0.8rem 0 0.8rem"
        document.querySelectorAll("p").forEach((element) => {
          element.style.marginBottom = "0px"
        })
      } else {
        articleContent.style.padding = ""
        document.querySelectorAll("p").forEach((element) => {
          element.style.marginBottom = ""
        })
      }
    }
  }

  // Initialize ResizeObserver
  const resizeObserver = new ResizeObserver(() => {
    adjustVerticalSize()
  })
  if (infopanel) {
    resizeObserver.observe(infopanel)
  }

  adjustVerticalSize() // Initial adjustment
  return () => {
    if (infopanel) {
      resizeObserver.unobserve(infopanel)
    }
  } // Cleanup on unmount
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Extract the current Wikipedia page's name, start date, end date, and Wikidata ID
//TODOlater use dayjs library for date format () and make sure all dates are displayed similarly
const extractCurrentWikipediaPageDatesData = async (
  linkUrl: any,
  html: any,
  urlWikipedia: any,
  currentWikipediaPageName: any,
  setCurrentWikipediaPageName: any,
  setCurrentWikipediaPageDateStart: any,
  setCurrentWikipediaPageDateEnd: any,
  setCurrentWikipediaPageWdId: any,
) => {
  if (!linkUrl) {
    console.log("Invalid linkUrl:", linkUrl)
    return
  }
  try {
    const url: any = new URL(linkUrl)
    const pageName = decodeURIComponent(url.pathname.split("/").pop())
    setCurrentWikipediaPageName(pageName)

    const doc = new DOMParser().parseFromString(html, "text/html")
    const infobox = doc.querySelector("table.Infobox")
    const { ibStart, ibEnd } = extractDatesFromInfobox(infobox) //ibStart, ibEnd = dates from infobox

    //if start-endDates are within the page, no need to search the wikidata ID
    if (ibStart) {
      setCurrentWikipediaPageDateStart(ibStart)
      setCurrentWikipediaPageDateEnd(ibEnd)
      setCurrentWikipediaPageWdId("not needed")
    } else {
      //if start-endDates are NOT within the page, let's find them through the wikidata ID
      const wdId =
        (await extractWikidataLinkFromCurrentPage(doc)) || //let's find it within the page
        (await getOneWikidataID(urlWikipedia, pageName)) //if not found, let's fetch it from the API
      if (wdId) {
        // let's fetch start-end dates from the wikidata API
        setCurrentWikipediaPageWdId(wdId)
        const wikidataDates = await fetchOneDateRangeFromOneWikidataId(wdId)
        setCurrentWikipediaPageDateStart(wikidataDates.wdStart)
        setCurrentWikipediaPageDateEnd(wikidataDates.wdEnd)
      } else {
        // Forget it, we couldn't find start-endDate nor the Wikidata ID
        setCurrentWikipediaPageDateStart("")
        setCurrentWikipediaPageDateEnd("")
        setCurrentWikipediaPageWdId("not found within page, neither with wikipedia API")
      }
    }
  } catch (error) {
    console.error("Failed to construct URL:", error)
    return
  }
}
//TODOlater fetchManyDateRangesFromManyWikidataId
const fetchManyDateRangesFromManyWikidataIds = async (wdIds: any, batchSize = 50) => {
  /*
quickly generated by chatGPT => needs to be tested !!!
you can fetch multiple Wikidata IDs in a single request to get birthdate and deathdate information faster than fetching them one by one. This can be done using the Wikidata Query Service (WDQS) with SPARQL queries.
Create a SPARQL query to fetch birthdate and deathdate for multiple Wikidata IDs.
Use the Wikidata Query Service endpoint to execute the SPARQL query.
Split the Wikidata IDs into smaller batches to avoid hitting query limits.
Fetch each batch concurrently.
Combine the results from all batches.

Example:
const fetchManyDateRangesFromManyWikidataIds = async (wdIds, batchSize = 50) => {
  const fetchBatch = async (batch) => {
    const sparqlQuery = `
      SELECT ?item ?itemLabel ?birthDate ?deathDate WHERE {
        VALUES ?item { ${batch.map(id => `wd:${id}`).join(' ')} }
        OPTIONAL { ?item wdt:P569 ?birthDate. }
        OPTIONAL { ?item wdt:P570 ?deathDate. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }
    `;

    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}`;
    const headers = { 'Accept': 'application/sparql-results+json' };

    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      return data.results.bindings.map(binding => ({
        id: binding.item.value.split('/').pop(),
        label: binding.itemLabel.value,
        birthDate: binding.birthDate ? binding.birthDate.value : null,
        deathDate: binding.deathDate ? binding.deathDate.value : null,
      }));
    } catch (error) {
      console.error('Error fetching date ranges from Wikidata:', error);
      return [];
    }
  };

  // Split the wdIds into batches
  const batches = [];
  for (let i = 0; i < wdIds.length; i += batchSize) {
    batches.push(wdIds.slice(i, i + batchSize));
  }

  // Fetch all batches concurrently
  const results = await Promise.all(batches.map(fetchBatch));

  // Combine all results into a single array
  return results.flat();
};



  // Example usage
  const wdIds = ['Q42', 'Q937', 'Q801'];
  fetchDateRangesFromWikidataIds(wdIds).then(data => console.log(data));
  */
}
const fetchOneDateRangeFromOneWikidataId = async (wdId: any) => {
  // performance 158-487ms
  try {
    const response = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wdId}.json`)
    if (!response.ok) throw new Error("Failed to fetch Wikidata")

    const data = await response.json()
    const entity = data.entities[wdId]
    return extractDatesFromWikidataEntity(entity)
  } catch (error) {
    console.error("Error fetching Wikidata:", error)
    return { wdStart: "", wdEnd: "" }
  }
}
const extractDatesFromWikidataEntity = (entity: any) => {
  // performance 0ms
  const getDate = (property: any) => entity?.claims?.[property]?.[0]?.mainsnak?.datavalue?.value?.time || ""
  const wdStart =
    getDate("P569") ||
    getDate("P580") ||
    getDate("P7588") ||
    getDate("P577") ||
    getDate("P571") ||
    getDate("P585") ||
    getDate("P619")
  const wdEnd = getDate("P570") || getDate("P582") || getDate("P620")
  return { wdStart: wdStart, wdEnd: wdEnd }
  // 569=birthDate, 570=deathDate, 580=startTime, 582=endTime, 7588=effectiveTime, 577=publicationDate, 571=inceptionDate, 585=pointTime, 619=launchTime, 620=landingTime

  /* old code
    const birthDate = entity?.claims?.P569?.[0]?.mainsnak?.datavalue?.value?.time || '';
    const deathDate = entity?.claims?.P570?.[0]?.mainsnak?.datavalue?.value?.time || '';
    if (birthDate) return { wdStart: birthDate, wdEnd: deathDate };

    const startTime = entity?.claims?.P580?.[0]?.mainsnak?.datavalue?.value?.time || '';
    const endTime = entity?.claims?.P582?.[0]?.mainsnak?.datavalue?.value?.time || '';
    if (startTime) return { wdStart: startTime, wdEnd: endTime };

    const effectiveTime = entity?.claims?.P7588?.[0]?.mainsnak?.datavalue?.value?.time || '';
    if (effectiveTime) return { wdStart: effectiveTime, wdEnd: '' };

    const publicationDate = entity?.claims?.P577?.[0]?.mainsnak?.datavalue?.value?.time || '';
    if (publicationDate) return { wdStart: publicationDate, wdEnd: '' };

    const inceptionDate = entity?.claims?.P571?.[0]?.mainsnak?.datavalue?.value?.time || '';
    if (inceptionDate) return { wdStart: inceptionDate, wdEnd: '' };

    const pointTime = entity?.claims?.P585?.[0]?.mainsnak?.datavalue?.value?.time || '';
    if (pointTime) return { wdStart: pointTime, wdEnd: '' };

    const launchTime = entity?.claims?.P619?.[0]?.mainsnak?.datavalue?.value?.time || '';
    const landingTime = entity?.claims?.P620?.[0]?.mainsnak?.datavalue?.value?.time || '';
    if (launchTime) return { wdStart: launchTime, wdEnd: landingTime };

    return { wdStart: '', wdEnd: '' };
  */
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// try to find the dates from the infobox (within the page)
const extractDatesFromInfobox = (infobox: any) => {
  const thElements = infobox?.querySelectorAll("th")

  const dateMappings = [
    { text: "Date", regex: findTwoDatesFromText },
    { text: "Release", regex: findTwoDatesFromText },
    { text: "Effective", regex: (text: any) => ({ ibStart: findOneDateFromText(text), ibEnd: "" }) },
    { text: "Born", regex: (text: any) => ({ ibStart: findOneDateFromText(text), ibEnd: "" }) },
    { text: "Publication date", regex: (text: any) => ({ ibStart: findOneDateFromText(text), ibEnd: "" }) },
    { text: "Founded", regex: (text: any) => ({ ibStart: findOneDateFromText(text), ibEnd: "" }) },
    { text: "Independence", regex: (text: any) => ({ ibStart: findOneDateFromText(text), ibEnd: "" }) },
    { text: "Established", regex: (text: any) => ({ ibStart: findOneDateFromText(text), ibEnd: "" }) },
    { text: "Launch date", regex: (text: any) => ({ ibStart: findOneDateFromText(text), ibEnd: "" }) },
    { text: "Died", regex: (text: any) => ({ ibStart: "", ibEnd: findOneDateFromText(text) }) },
    { text: "Landing date", regex: (text: any) => ({ ibStart: "", ibEnd: findOneDateFromText(text) }) },
  ]

  const setDates = (acc: any, thText: any, regex: any) => {
    thElements?.forEach((th: any) => {
      if (th.textContent.includes(thText)) {
        const td =
          thText === "Independence"
            ? th.parentElement?.nextElementSibling?.nextElementSibling.querySelector("td")
            : th.nextElementSibling
        if (td) {
          const dateText = td.textContent.trim()
          const { ibStart, ibEnd } = regex(dateText)
          acc.ibStart = ibStart || acc.ibStart
          acc.ibEnd = ibEnd || acc.ibEnd
        }
      }
    })
    return acc
  }

  const { ibStart, ibEnd } = dateMappings.reduce((acc, { text, regex }) => setDates(acc, text, regex), {
    ibStart: "",
    ibEnd: "",
  })

  return { ibStart, ibEnd }
}
const findOneDateFromText = (text: any) => {
  // text: extract dates in various formats
  const datePatterns = [
    /(\d{1,2} \w+ \d{4})/, // e.g., "4 January 1643"
    /(\w+ \d{1,2}, \d{4})/, // e.g., "February 12, 1809"
    /(\d{1,2} \w+ \d{1,4} BC)/, // e.g., "21 March 44 BC"
    /(\d{1,4} (BC|BBY|AD|BCE|CE))/, // e.g., "c. 563 BC"
    /(\d{1,4})\/(\d{1,4})\s+or\s+(\d{1,4})\/(\d{1,4})\s?BC/, // e.g., "c. 563/480 or 490/480 BC"
    /(\d{4})/, // e.g., "1809"
  ]

  for (const pattern of datePatterns) {
    const match = text.replace(/\u00A0/g, " ").match(pattern)
    if (match) return match[0]
  }
  return ""
}
const findTwoDatesFromText = (text: any) => {
  //  extract date information (if it can't find 2 dates, it tries 1  date)
  const match = text
    .replace(/\u00A0/g, " ")
    .trim()
    .match(
      /(\d{1,2} \w+ \d{4}|\d{1,2} \w+|\w+ \d{1,2}, \d{4})\s?.*?\s?(\d{1,2} \w+ \d{4}|\d{1,2} \w+|\w+ \d{1,2}, \d{4})/,
    )
  return match ? { ibStart: match[1], ibEnd: match[2] } : { ibStart: findOneDateFromText(text), ibEnd: "" }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// try to find the Wikidata ID within the current Wikipedia page, it's always faster than fetching it from the API
const extractWikidataLinkFromCurrentPage = (doc: any) => {
  const wikidataLink = doc.querySelectorAll('a[href^="https://www.wikidata.org/wiki/Q"][href$="#identifiers"]')[0]
  const wdId = wikidataLink ? wikidataLink.href.split("/").pop().split("#")[0].split("?")[0] : null
  return wdId
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Fetch the Wikidata ID from a Wikipedia page
const getOneWikidataID = async (urlWikipedia: any, pageName: any) => {
  // performance 118-154ms
  try {
    const wikidataUrl =
      urlWikipedia + "/w/api.php?action=query&prop=pageprops&titles=" + pageName + "&format=json&origin=*"
    const response = await fetch(wikidataUrl)
    if (!response.ok) throw new Error("Failed to fetch Wikidata ID")
    const data = await response.json()
    const pages = data.query.pages
    const page: any = Object.values(pages)[0] // We expect one result per title
    if (page && page.pageprops && page.pageprops["wikibase_item"]) {
      const wdId = page.pageprops["wikibase_item"] // Wikidata ID
      console.log("wikidataId: " + wdId)
      return wdId
    } else {
      throw new Error("Wikidata ID not found")
    }
  } catch (error) {
    console.log("Error fetching Wikidata ID from Wikipedia API for Wikipedia page " + pageName)
    return null
  }
}
//make a single query to the API and fetch all the Wikidata IDs at once
//TODOlater: fetch many Wikidata IDs at once
const getManyWikidataIDs = async (urlWikipedia: any, pageNames: any) => {
  /* quickly generated by chatGPT => needs to be tested !!!
  const wikidataUrls = pageNames.map((pageName) => urlWikipedia + '/w/api.php?action=query&prop=pageprops&titles=' + pageName + '&format=json&origin=*');

  const responses = await Promise.all(wikidataUrls.map((wikidataUrl) => fetch(wikidataUrl)));
  const data = await Promise.all(responses.map((response) => response.json()));

  return data.map((response) => {
    const pages = response.query.pages;
    const page = Object.values(pages)[0]; // We expect one result per title
    return page && page.pageprops && page.pageprops['wikibase_item'] ? page.pageprops['wikibase_item'] : null;
  });
  */
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Extract Images from the Wikipedia HTML content
//TODOlater infobox: keep image and its comment
const extractImages = (urlWikipedia: any, html: any) => {
  // performance 2-43ms
  const doc = new DOMParser().parseFromString(html, "text/html")

  // Update all <a> href attributes to point to the actual Wikipedia domain
  doc.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href")
    if (href && !href.startsWith("http")) {
      link.setAttribute("href", `${urlWikipedia}${href}`)
    }
  })

  const contentContainer = document.createElement("div")
  const imageSelectors = [
    ".thumb.tmulti.tright .thumbinner.multiimageinner .trow",
    ".thumb.tnone",
    "figure",
    ".infobox",
    ".gallerybox",
  ]

  imageSelectors.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((element: any) => {
      element.style.width = "min-content"
      element.style.border = "1px solid var(--color-wikipediaimagesborder, red)"
      element.style.background = "var(--color-wikipediaimagesbackground, purple)"
      contentContainer.appendChild(element.cloneNode(true))
    })
  })
  return contentContainer.innerHTML
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Remove unwanted sections and their content
  //TODOlater put these in settings as checkboxes
  const sectionsToRemove = [
    "Notes",
    "Footnotes",
    "Explanatory notes",
    "References",
    "Works cited",
    "Publications",
    "Sources",
    "Bibliography",
    //"External links",
    "Awards and honors",
  //  "See also",
    "Further reading",
  ]

  // Clean the Wikipedia HTML content
const cleanContent = (urlWikipedia: any, html: any) => {
  const doc = new DOMParser().parseFromString(html, "text/html")

  // Update href attributes
  hrefAttributes(doc, urlWikipedia)

  // Remove unwanted selectors
  removeSelectors(doc)


  sectionsToRemove.forEach((heading) => {
    const elements = Array.from(doc.querySelectorAll("h2, h3, h4"))
    elements.forEach((el: any) => {
      if (el.textContent.trim() === heading) {
        let section = el.nextElementSibling
        while (section && !["H2", "H3", "H4"].includes(section.tagName)) {
          const next = section.nextElementSibling
          section.remove()
          section = next
        }
        el.remove()
      }
    })
  })

  // Remove edit links
  doc.querySelectorAll(".mw-editsection").forEach((el) => el.remove())

  // Remove reference numbers/citations
  doc.querySelectorAll("sup.reference, sup.Inline-Template").forEach((el) => el.remove())

  // Remove square brackets with numbers and citation needed
  doc.querySelectorAll("a, span").forEach((element: any) => {
    // Remove [citation needed], [by whom], etc.
    if (
      element.classList.contains("citation-needed") ||
      element.hasAttribute("data-ve-attributes") ||
      /\[(citation needed|by whom|according to whom|when|where)\]/i.test(element.textContent)
    ) {
      element.remove()
    }
    // Remove numbered references [1], [2], etc.
    if (element.textContent.match(/^\[\d+\]$/)) {
      element.remove()
    }
  })

  // Remove any remaining inline citations or editorial notes in square brackets
  const html_without_citations = doc.body.innerHTML.replace(
    /\[(citation needed|by whom|according to whom|when|where)\]/gi,
    ""
  )

  return html_without_citations
}
const hrefAttributes = (doc: any, urlWikipedia: any) => {
  // Update all <a> href attributes to point to the actual Wikipedia domain
  doc.querySelectorAll("a").forEach((link: any) => {
    const href = link.getAttribute("href")
    if (href && !href.startsWith("http")) {
      link.setAttribute("href", `${urlWikipedia}${href}`)
    }
  })
}
const removeSelectors = (doc: any) => {
  // Remove unwanted selectors
  const selectorsToRemove = [
    'div[role="note"].hatnote.navigation-not-searchable',
    'div[role="navigation"].navbox',
    "div.thumb.tmulti.tright",
    "div.thumb.tmulti.tnone.center",
    "div.thumb.tnone",
    // "div.reflist",
    // "div.mw-references-wrap",
    // "ol.references",
    "span.mw-editsection",
    "figure",
    "table",
    "ul.gallery",
  ]
  if (sectionsToRemove.includes("References")) {
    selectorsToRemove.push("div.reflist", "div.mw-references-wrap", "ol.references");
  }

  selectorsToRemove.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((element: any) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  });
  selectorsToRemove.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((element: any) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })
  })
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const extractAllLinksFromCleanHtml = async (rawHtml: any) => {
  // Create a DOM parser to parse the raw HTML
  const instanceDom = new DOMParser()
  const docDom = instanceDom.parseFromString(rawHtml, "text/html")

  // Find the last <p> element in the document
  const lastParagraph = docDom.querySelectorAll("p")
  const lastParagraphElement = lastParagraph[lastParagraph.length - 1]

  // Get the HTML content from the start of rawHtml up to the last <p> element
  const removedIAL = rawHtml.slice(
    0,
    rawHtml.indexOf(lastParagraphElement.outerHTML) + lastParagraphElement.outerHTML.length,
  )

  // Parse the extracted content
  const parsedDom = new DOMParser().parseFromString(removedIAL, "text/html")

  // Select all Wikipedia links that contain _ - %, 0-9, a-z in their URLs
  const links = parsedDom.querySelectorAll(
    'a[href*="/wiki/"][href*="_"], a[href*="/wiki/"][href*="-"], a[href*="/wiki/"][href*="%"], a[href*="/wiki/"][href*="0"], a[href*="/wiki/"][href*="1"], a[href*="/wiki/"][href*="2"], a[href*="/wiki/"][href*="3"], a[href*="/wiki/"][href*="4"], a[href*="/wiki/"][href*="5"], a[href*="/wiki/"][href*="6"], a[href*="/wiki/"][href*="7"], a[href*="/wiki/"][href*="8"], a[href*="/wiki/"][href*="9"], a[href*="/wiki/"][href*="a"], a[href*="/wiki/"][href*="b"], a[href*="/wiki/"][href*="c"], a[href*="/wiki/"][href*="d"], a[href*="/wiki/"][href*="e"], a[href*="/wiki/"][href*="f"], a[href*="/wiki/"][href*="g"], a[href*="/wiki/"][href*="h"], a[href*="/wiki/"][href*="i"], a[href*="/wiki/"][href*="j"], a[href*="/wiki/"][href*="k"], a[href*="/wiki/"][href*="l"], a[href*="/wiki/"][href*="m"], a[href*="/wiki/"][href*="n"], a[href*="/wiki/"][href*="o"], a[href*="/wiki/"][href*="p"], a[href*="/wiki/"][href*="q"], a[href*="/wiki/"][href*="r"], a[href*="/wiki/"][href*="s"], a[href*="/wiki/"][href*="t"], a[href*="/wiki/"][href*="u"], a[href*="/wiki/"][href*="v"], a[href*="/wiki/"][href*="w"], a[href*="/wiki/"][href*="x"], a[href*="/wiki/"][href*="y"], a[href*="/wiki/"][href*="z"]',
  )

  return links
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const extractWikidataIdsOneByOne = async (links: any, urlWikipedia: any, setLinkStatuses: any) => {
  const linkedWikipediaPagesDatesData = [];
  for (const link of links) {
    const href = link.getAttribute("href");
    const uriWikipedia = href.split("/wiki/")[1];
    if (uriWikipedia) {
      const wikidataId = await getOneWikidataID(urlWikipedia, uriWikipedia);
      if (wikidataId) {
        const wikidataDates = await fetchOneDateRangeFromOneWikidataId(wikidataId);
        if (wikidataDates.wdStart || wikidataDates.wdEnd) {
          linkedWikipediaPagesDatesData.push({
            name: uriWikipedia,
            wdId: wikidataId,
            wdStart: wikidataDates.wdStart,
            wdEnd: wikidataDates.wdEnd,
          });
          setLinkStatuses((prev: any) => ({ ...prev, [href]: "wp-detected" }));
        } else {
          setLinkStatuses((prev: any) => ({ ...prev, [href]: "wp-not-detected" }));
        }
      } else {
        setLinkStatuses((prev: any) => ({ ...prev, [href]: "wp-not-detected" }));
      }
    }
  }
  return linkedWikipediaPagesDatesData;
};
//TODOlater: replace with extractManyWikidataIdsAtOnce => ONE API query to fetch all dates at once
// const extractManyWikidataIdsAtOnce = async (links: any, urlWikipedia: any) => {
//   return linkedWikipediaPagesDatesData
// }
