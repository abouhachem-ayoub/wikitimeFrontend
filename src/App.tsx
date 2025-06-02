import { UserProvider } from "contexts/UserContext";
import Wikitime from "./components/Wikitime";

const App = (): JSX.Element => {
  return (
    <>
    <UserProvider>
      <Wikitime />
    </UserProvider>
    </>
  );
};

export default App;