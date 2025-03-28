import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./defaultlayout";
import Home from "../pages/home";
import Songdetail from "../pages/songdetailedpage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/song/:id",
                element: <Songdetail />
            },
        ]
    }
])

export default router