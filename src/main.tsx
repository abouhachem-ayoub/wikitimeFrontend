import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import { LayersSettingsProvider } from "hooks";
import { initializeCustomProperties } from "./config/CustomProperties";
import i18n from "./config/i18n";
import { AppProvider } from "./contexts/ContextApp";
import { TimeLineProvider } from "./contexts/ContextTimeLine";
import { WikipediaProvider } from "./contexts/ContextWikipedia";
import App from "./App";
import { TimePanelProvider } from 'contexts/ContextTimePanel';
import { UserProvider } from "contexts/UserContext";

import "./styles/index.scss";

// Initialize CSS custom properties
initializeCustomProperties();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create root and render the App component
createRoot(rootElement).render(
  <StrictMode>
    
    <I18nextProvider i18n={i18n}>
      <AppProvider>
        <UserProvider>
        <WikipediaProvider>
          <TimeLineProvider>
            <TimePanelProvider>
              <LayersSettingsProvider>
                <App />
              </LayersSettingsProvider>
            </TimePanelProvider>
          </TimeLineProvider>
        </WikipediaProvider>
        </UserProvider>
      </AppProvider>
    </I18nextProvider>
  </StrictMode>
);