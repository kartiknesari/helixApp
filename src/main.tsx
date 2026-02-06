import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import { createHashRouter, RouterProvider } from "react-router";
import "./index.css";

// Page Imports
import Catalog from "./app/Catalog.tsx";
import Questionnaire from "./app/Questionnaire.tsx";
import Comparison from "./app/Comparison.tsx";
import ExperienceLoader from "./app/ExperienceLoader.tsx";
import VoiceAgent from "./app/VoiceAgent.tsx"; //

/**
 * Client-side Router Configuration
 * Using createHashRouter for compatibility with Electron's file-based protocol.
 */
const route = createHashRouter([
    {
        path: "/",
        Component: App,
    },
    { 
        path: "/voice", 
        Component: VoiceAgent // Added route for the Voice AI Assistant
    },
    { 
        path: "/catalog", 
        Component: Catalog 
    },
    { 
        path: "/recommender", 
        Component: Questionnaire 
    },
    {
        path: "/compare",
        Component: () => <Comparison currentProduct={null} />,
    },
    {
        path: "product/:id",
        Component: ExperienceLoader,
    },
]);

// Render the Application
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={route} />
    </React.StrictMode>
);

/**
 * IPC Communication
 * Listening for messages from the Electron Main Process via the contextBridge.
 */
window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log("Message from Main Process:", message);
});