import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenFromUrl } from "../../../spotifyAuth";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = getTokenFromUrl();
    const token = hash.access_token;

    if (token) {
      localStorage.setItem("spotify_token", token);
      navigate("/");
    }
  }, [navigate]);

  return <h1>Logging in...</h1>;
};

export default Callback;