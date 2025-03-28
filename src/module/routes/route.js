import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Songdetail from "../pages/songdetailedpage";
import SearchResults from "../pages/search";
import DefaultLayout from './defaultlayout';
import Albumdetail from "../pages/albumdetail";
import Artistdetail from "../pages/artistdetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/song/:id",
        element: <Songdetail />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      },
      {
        path: "/album/:id",
        element: <Albumdetail />,
      },
      {
        path: "/artist/:id",
        element: <Artistdetail />,
      },
    ],
  },
]);

export default router;