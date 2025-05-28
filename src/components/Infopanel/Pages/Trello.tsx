import { useEffect } from 'react';

const Trello: React.FC = () => {

  useEffect(() => {window.open('https://trello.com/b/wvak6CBo/wikitipedia', '_blank');}, []);

  return (
    <div>
      The Trello board has been opened in a new tab.
    </div>
  );
};

export default Trello;
