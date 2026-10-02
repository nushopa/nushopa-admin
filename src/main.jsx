import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import { ThemeProvider } from "@material-tailwind/react";
import "./config/phantom.config.js";
import CookieGate from "./components/cookies/CookieGate.jsx";
import SessionLoader from "./components/cookies/SessionLoader.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CookieGate />
          <SessionLoader>
            <App />
          </SessionLoader>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
);
