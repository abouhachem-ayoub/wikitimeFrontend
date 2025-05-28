const Sources: React.FC = () => {
  return (
    <>
      <h2>Sources</h2>
      <p>Any provider can create their own data. Users will chose the one they like.</p>
      <p>4 sources of information in wikitime:</p>
      <ul>
        <li>Timeline: a list of timeObjects with priorities, some priorities are dynamic. Select source in the settings.</li>
        <li>Timeviews: a list of navigation buttons, customizable, sharable (json).</li>
        <li>Content: detailed information from an online db. The default one is Wikipedia. Select source in the content section.</li>
        <li>Timeboxes: user generated content. Select source in the catalogs section.</li>
      </ul>
    </>
  );
};

export default Sources;
