import React, { useState, useEffect } from "react";
import "./header.scss";
import { FaSearch } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/icons/logo";

export default function Header({ onSearch }) {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const userData = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-logo">
          <NavLink to={"/"}>
            <Logo />
          </NavLink>
        </div>
      </div>

      <div className="header-center">
        <NavLink to="/" className="header-home-button">
          <AiFillHome />
        </NavLink>
        <div className="header-search">
          <div className="header-search-icon">
            <FaSearch onClick={handleSearch} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What do you want to play?" 
          />
        </div>
      </div>

      <div className="header-right">
        {user ? (
          <button className="header-profile">
            <img src={user.picture} alt={user.name} title={user.name} />
          </button>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Login Failed")}
            useOneTap
          />
        )}
      </div>
    </div>
  );
}
