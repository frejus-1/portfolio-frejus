import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext";
import { registerSW } from "virtual:pwa-register";

registerSW({
    immediate: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </React.StrictMode>
);