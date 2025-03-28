import React, { useState, useEffect } from 'react'
import "./header.scss"
import { FaSearch } from 'react-icons/fa'
import { AiFillHome } from 'react-icons/ai'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const userData = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-logo">
          <h1>Echozy</h1>
        </div>
      </div>
      
      <div className="header-center">
        <button className="header-home-button">
          <AiFillHome />
        </button>
        <div className="header-search">
          <div className="header-search-icon">
            <FaSearch />
          </div>
          <input type="text" placeholder="What do you want to play?" />
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
            onError={() => console.log('Login Failed')}
            useOneTap
          />
        )}
      </div>
    </div>
  )
}
