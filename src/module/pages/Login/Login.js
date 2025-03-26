import React, { useEffect, useRef } from "react";
import { loginUrl } from "../../../spotifyAuth";
import Spotifyicon from "../../../assets/icons/Spotifyicon";
import "../../../styles/login.scss";
import { NavLink } from "react-router-dom";

const Login = () => {
  const particles = Array(15).fill(null);
  const musicNotes = ["♪", "♫", "♩", "♬", "♭", "♮", "♯", "𝄞"];
  const notesRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      notesRef.current.forEach((note, index) => {
        if (!note) return;

        const rect = note.getBoundingClientRect();
        const noteX = rect.left + rect.width / 2;
        const noteY = rect.top + rect.height / 2;

        const distanceX = mouseX - noteX;
        const distanceY = mouseY - noteY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < 150) {
          const pushForce = (150 - distance) / 3;
          const angleX = (distanceX / distance) * pushForce;
          const angleY = (distanceY / distance) * pushForce;
          const rotation = (Math.atan2(distanceY, distanceX) * 180) / Math.PI;

          note.style.transform = `translate(${-angleX}px, ${-angleY}px) rotate(${rotation}deg)`;
          note.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          note.style.zIndex = '100';
        } else {
          note.style.transform = '';
          note.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          note.style.zIndex = index.toString();
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="login-page">
      {particles.map((_, i) => (
        <div key={`particle-${i}`} className="particle" />
      ))}
      <div className="music-notes-main">
        {musicNotes.map((note, i) => (
          <div
            key={`note-${i}`}
            className="music-note"
            ref={(el) => (notesRef.current[i] = el)}
          >
            {note}
          </div>
        ))}
      </div>
      <h1>Welcome to Echozy</h1>
      <p
        style={{
          color: "#fff",
          marginBottom: "32px",
          fontSize: "19px",
          opacity: 0.9,
        }}
      >
        Your personal music companion
      </p>
      <NavLink to={loginUrl}>
        <button className="Login-button">
          <Spotifyicon />
          <span>Continue with Spotify</span>
        </button>
      </NavLink>
    </div>
  );
};

export default Login;
