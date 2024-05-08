import ReactDOM from "react-dom/client";
import "@/index.css";
import { CookiesProvider } from "react-cookie";
import { RouterProvider } from "react-router-dom";
import router from "@/lib/router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <CookiesProvider>
        <RouterProvider router={router} />
    </CookiesProvider>,
);
