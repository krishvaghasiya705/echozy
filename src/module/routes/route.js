import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./defaultlayout";
import Home from "../pages/home";
import Login from "../pages/Login/Login";
import Callback from "../pages/Callback/Callback";
import Musicpage from "../pages/music";

const token = localStorage.getItem("spotify_token");

const router = createBrowserRouter([
  {
    path: "/",
    element: token ? <DefaultLayout /> : <Login />,
    children: [
      {
        path: "/",
        element: token ? <Home token={token} /> : <Login />,
      },
      {
        path: "/musicpage",
        element: <Musicpage />,
      },
    ],
  },
  {
    path: "/callback",
    element: <Callback />,
  },
]);

export default router;