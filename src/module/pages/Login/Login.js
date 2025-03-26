import React from "react";
import { loginUrl } from "../../../spotifyAuth";

const Login = () => {
  return (
    <div className="login-page">
      <h1>Welcome to Echozy</h1>
      <a href={loginUrl}>Login with Spotify</a>
    </div>
  );
};

export default Login;