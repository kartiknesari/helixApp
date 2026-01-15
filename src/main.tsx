import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import { createBrowserRouter } from "react-router";
// import { Route } from "react-router";
import { RouterProvider } from "react-router";
import "./index.css";
import Catalog from "./app/Catalog.tsx";

const route = createBrowserRouter([
    {
        path: "/",
        Component: App,
    },
    { path: "/catalog", Component: Catalog },
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
