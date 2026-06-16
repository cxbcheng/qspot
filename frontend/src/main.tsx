import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./root.tsx";
import "./styles.css"; 
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import routes from "./routes.ts";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);