import { useContext, useState, useEffect } from 'react';
import { ContextWikipedia } from '../../contexts/ContextWikipedia';
import { string2date } from '../../utils/misc';

const WikiDatesTable: React.FC = () => {
  const { urlWikipedia, wikiDatesData } = useContext(ContextWikipedia);

  //TODOnow scrollbar when table is too big

  //TODOnow 1st line # of pages processed / # links to process + avg time to process a link

  //TODOnow display progressively, erase when a new WPpage is loaded

  //TODOnow time to get the list of linksID with no duplicates

  //TODOnow time to get the list of startend from IBs
  //TODOnow time to get the list of WDid
  //TODOnow time to get the list of startend from WDid

  //TODOnow if there is a diff between IB and WD, display it in red

  //TODOnow WP starting with "Help:", "Wikipedia:": should be ignored

  const prefix = urlWikipedia + "/wiki/";
  const openWP = (name: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`${prefix}${name}`, "_blank");
  };

  const openWD = (wdId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`${prefix}${wdId}`, "_blank");
  };

  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    // Remove duplicates based on both name and wdId
    const uniqueRows = wikiDatesData.filter(
      (row: any, index: any, self: any) => index === self.findIndex((r: any) => r.name === row.name && r.wdId === row.wdId),
    );
    setRows(uniqueRows);
  }, [wikiDatesData]);

  /*
  const addRow = () => {
    const newRow = {
      name: 'New Entry',
      wdId: 'Q0',
      wdStart: new Date().toISOString(),
      wdEnd: new Date().toISOString(),
    };
    setRows([...rows, newRow]);
  };
  */

  if (!wikiDatesData || wikiDatesData.length === 0) {
    // if wikiDatesData is empty, display at least the headers
    return (
      <div className="table-container">
        {/*<button onClick={addRow} className='debug_buttons'>Add Row</button>*/}
        <table className="table">
          <thead>
            <tr>
              <th>Url WP</th>
              <th>WD id</th>
              <th>WD start</th>
              <th>WD end</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    rows &&
    rows.length > 0 && (
      <div className="table-container">
        {/*<button onClick={addRow} className='debug_buttons'>Add Row</button>*/}
        <table className="table">
          <thead>
            <tr>
              <th>Url WP</th>
              <th>WD id</th>
              <th>WD start</th>
              <th>WD end</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry, index) => (
              <tr key={index}>
                <td className="table-hyperlink">
                  <a onClick={openWP(entry.name)}>{entry.name}</a>
                </td>
                <td className="table-hyperlink">
                  <a onClick={openWD(entry.wdId)}>{entry.wdId}</a>
                </td>
                <td>{string2date(entry.wdStart)}</td>
                <td>{string2date(entry.wdEnd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};

export default WikiDatesTable;
