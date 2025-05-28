import React from 'react';

const DisplayTable: React.FC<{ title: string, data: { [key: string]: any }[] }> = ({ title, data }) => {

  if (!data || data.length === 0) { return <div>No data available</div>; }

  const headers = Object.keys(data[0]);

  return (
    <div>
      <p className="table" style={{ display: 'inline' }}>data from </p>
      <h2 style={{ display: 'inline' }}>{title}</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td key={header}>{item[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*)}*/}
    </div>
  );
};

export default DisplayTable;
