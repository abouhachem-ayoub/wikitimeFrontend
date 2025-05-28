import { useState, useContext, useCallback, FormEvent, ChangeEvent } from "react";
import { ContextWikipedia } from "../../contexts/ContextWikipedia";

// TODOnow if isVertical infopanel = min-width of infopanel = queryBox
// TODOnow if !isVertical infopanel = min-height infopanel = 20% of screen height
const WikipediaQueryBox: React.FC = () => {
  const { setSearchResults, urlWikipedia } = useContext(ContextWikipedia);
  const [query, setQuery] = useState<string>("");

  // Debounce function to limit API calls
  const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Memoize the search function to prevent recreation on each render
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      const results = await fetchWikipediaResults(urlWikipedia, searchQuery);
      setSearchResults(results);
    },
    [urlWikipedia, setSearchResults]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => performSearch(value), 300),
    [performSearch]
  );

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    await performSearch(query);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  return (
    <form onSubmit={handleSearch} className="query-search-active">
      <input type="text" value={query} onChange={handleChange} placeholder="Search Wikipedia" />
    </form>
  );
};

export default WikipediaQueryBox;

const fetchWikipediaResults = async (urlWikipedia: any, query: any) => {
  try {
    const response = await fetch(
      `${urlWikipedia}/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`,
    )
    const data = await response.json()
    if (data.query && data.query.search) {
      return data.query.search
    } else {
      console.error("Error: data.query.search is undefined")
      return []
    }
  } catch (error) {
    console.error("Error fetching Wikipedia results:", error)
    return []
  }
}

// with a search button
/*
  const handleSearch = async (e) => {
    e.preventDefault();
    const apiUrl = `${urlWikipedia}/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data?.query?.search) {
        setSearchResults(data.query.search);
        setWikipediaSearchResultsAvailable(true);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  //AEFFlocalization placeholder="Search Wikipedia" + >Search</button>
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Wikipedia"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};*/