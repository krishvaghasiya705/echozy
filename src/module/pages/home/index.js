import React, { useEffect, useState } from "react";
import axios from "axios";

function Home({ token }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    axios
      .get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      });
  }, [token]);

  return (
    <div>
      <h1>Welcome, {user?.display_name}</h1>
    </div>
  );
}

export default Home;