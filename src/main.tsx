import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import { createHashRouter } from "react-router";
// import { Route } from "react-router";
import { RouterProvider } from "react-router";
import "./index.css";
import Catalog from "./app/Catalog.tsx";
import Questionnaire from "./app/Questionnaire.tsx";
import Comparison from "./app/Comparison.tsx";
import ExperienceLoader from "./app/ExperienceLoader.tsx";

const route = createHashRouter([
    {
        path: "/",
        Component: App,
    },
    { path: "/catalog", Component: Catalog },
    { path: "/recommender", Component: Questionnaire },
    {
        path: "/compare",
        Component: () => <Comparison currentProduct={null} />,
    },
    {
        path: "product/:id",
        Component: ExperienceLoader,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={route} />
        {/* <App /> */}
    </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
});
