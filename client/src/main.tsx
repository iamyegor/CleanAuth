import ReactDOM from "react-dom/client";
import "@/index.css";
import { CookiesProvider } from "react-cookie";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/lib/routes.tsx";
import "react-loading-skeleton/dist/skeleton.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <CookiesProvider>
        <RouterProvider router={createBrowserRouter(routes)} />
    </CookiesProvider>,
);
