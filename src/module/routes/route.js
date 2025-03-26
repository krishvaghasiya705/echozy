import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./defaultlayout";
import Home from "../pages/home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            }
        ]
    }
])

export default router