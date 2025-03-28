import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipStartFill,
  BsSkipEndFill,
} from "react-icons/bs";
import { BiShuffle, BiRepeat } from "react-icons/bi";
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import { MdOutlineQueueMusic, MdTrendingUp } from "react-icons/md";
import { FaGuitar } from "react-icons/fa";
import { GiMicrophone } from "react-icons/gi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import "../../../styles/home.scss";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [currentSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalSongs, setTotalSongs] = useState(0);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [recentPlays, setRecentPlays] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [genres] = useState([
    { id: 1, name: "Pop", icon: <GiMicrophone />, color: "#FF4365" },
    { id: 2, name: "Rock", icon: <FaGuitar />, color: "#45B7D1" },
    { id: 3, name: "Hip Hop", icon: <GiMicrophone />, color: "#FFB86C" },
    { id: 4, name: "Dance", icon: <GiMicrophone />, color: "#50FA7B" },
  ]);
  const audioRef = useRef(null);
  const itemsPerPage = 100;

  // Load featured/trending songs on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          searchSongs("trending"),
          fetchTrendingSongs(),
          fetchFeaturedArtists(),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
      setLoading(false);
    };

    fetchInitialData();
    loadRecentPlays();
  }, []);

  const searchSongs = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://echozy-api.onrender.com/result/?query=${searchQuery}&limit=100`
      );
      const allSongs = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setSongs(allSongs);
      setTotalSongs(allSongs.length);
    } catch (error) {
      console.error("Error fetching songs:", error);
      setSongs([]);
    }
    setLoading(false);
  };

  const fetchTrendingSongs = async () => {
    try {
      const response = await axios.get(
        "https://echozy-api.onrender.com/result/?query=trending&limit=10"
      );
      setTrendingSongs(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (error) {
      console.error("Error fetching trending songs:", error);
    }
  };

  const fetchFeaturedArtists = async () => {
    try {
      const response = await axios.get(
        "https://echozy-api.onrender.com/result/?query=latest&limit=20"
      );
      const artistsData = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // Create unique artists map with proper data
      const artistsMap = new Map();
      artistsData.forEach((song) => {
        const artistNames = song.primary_artists.split(", ");
        const artistIds = song.primary_artists_id.split(", ");

        artistNames.forEach((name, index) => {
          const artistId = artistIds[index];
          if (!artistsMap.has(artistId) && artistId) {
            artistsMap.set(artistId, {
              id: artistId,
              name: name,
              image: song.image,
              description: "Featured Artist",
              type: "artist",
              query: name, // Add artist name as query parameter
            });
          }
        });
      });

      setFeaturedArtists([...artistsMap.values()].slice(0, 4));
    } catch (error) {
      console.error("Error fetching featured artists:", error);
    }
  };

  const loadRecentPlays = () => {
    const recent = JSON.parse(localStorage.getItem("recentPlays")) || [];
    setRecentPlays(recent);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const paginatedSongs = songs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0);
  };

  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.volume = value;
      setVolume(value);
      setIsMuted(value === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
      setCurrentTime(current);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const handleProgressHover = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const position =
      ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
    e.currentTarget.title = formatDuration(position);
  };

  useEffect(() => {
    if (currentSong?.media_url) {
      const audio = audioRef.current;
      if (audio) {
        audio.src = currentSong.media_url;
        audio.load();
        // Store isPlaying in a variable to use in the effect
        const shouldPlay = isPlaying;
        if (shouldPlay) {
          audio.play().catch((err) => console.error("Playback failed:", err));
        }
      }
    }
  }, [currentSong, isPlaying]); // Add isPlaying to dependencies

  const SongCardSkeleton = () => (
    <div className="song-card skeleton-card">
      <div className="song-image-container">
        <Skeleton height={200} />
      </div>
      <div className="song-info">
        <Skeleton width={180} height={24} />
        <Skeleton width={140} height={20} style={{ marginTop: 8 }} />
        <Skeleton width={160} height={20} style={{ marginTop: 8 }} />
        <div className="song-meta" style={{ marginTop: 12 }}>
          <Skeleton width={40} height={16} />
          <Skeleton width={60} height={16} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="music-page">
      <h1 className="main-title">Welcome to Echozy</h1>

      {/* Featured Section */}
      <section className="featured-section">
        <h2>
          <MdTrendingUp /> Featured Artists
        </h2>
        <div className="featured-grid">
          {featuredArtists.map((artist) => (
            <Link
              key={artist.id}
              to={`/artist/${encodeURIComponent(artist.query)}`} // Use artist name instead of ID
              className="featured-card"
            >
              <div>
                <img src={artist.image} alt={artist.name} loading="lazy" />
                <h3>{artist.name}</h3>
                <p>{artist.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Genres Section */}
      <section className="genres-section">
        <h2>Browse Genres</h2>
        <div className="genres-grid">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="genre-card"
              style={{ backgroundColor: genre.color }}
            >
              {genre.icon}
              <h3>{genre.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Plays Section */}
      {recentPlays.length > 0 && (
        <section className="recent-plays-section">
          <h2>Recently Played</h2>
          <div className="songs-container">
            {recentPlays.slice(0, 6).map((song, index) => (
              <Link
                key={index}
                to={`/song/${encodeURIComponent(song.perma_url)}`}
                className="song-card"
              >
                <div className="song-image-container">
                  <img
                    src={song.image}
                    alt={song.song}
                    className="song-image"
                  />
                  <div className="play-overlay">
                    <BsPlayFill size={24} />
                  </div>
                </div>
                <div className="song-info">
                  <h3 className="song-title">{song.song}</h3>
                  <p className="song-artists">{song.primary_artists}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending Section */}
      <section className="trending-section">
        <h2>Trending Now</h2>
        <div className="songs-container">
          {trendingSongs.map((song, index) => (
            <Link
              key={index}
              to={`/song/${encodeURIComponent(song.perma_url)}`}
              className="song-card trending-card"
            >
              <div className="song-image-container">
                <img src={song.image} alt={song.song} className="song-image" />
                <div className="play-overlay">
                  <BsPlayFill size={24} />
                </div>
                <div className="trending-number">#{index + 1}</div>
              </div>
              <div className="song-info">
                <h3 className="song-title">{song.song}</h3>
                <p className="song-artists">{song.primary_artists}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Original songs section */}
      <section className="all-songs-section">
        <h2>All Songs</h2>
        {loading ? (
          <>
            <h2 className="section-title">Loading trending songs...</h2>
            <div className="songs-container">
              {Array(itemsPerPage)
                .fill()
                .map((_, index) => (
                  <SongCardSkeleton key={index} />
                ))}
            </div>
          </>
        ) : (
          <>
            <div className="songs-container">
              {paginatedSongs.map((song, index) => (
                <Link
                  key={song.id || index}
                  to={`/song/${encodeURIComponent(song.perma_url)}`}
                  className="song-card"
                >
                  <div className="song-image-container">
                    <img
                      src={song.image}
                      alt={song.song}
                      className="song-image"
                    />
                    <div className="play-overlay">
                      {currentSong?.id === song.id && isPlaying ? (
                        <BsPauseFill size={24} />
                      ) : (
                        <BsPlayFill size={24} />
                      )}
                    </div>
                  </div>
                  <div className="song-info">
                    <h3 className="song-title">{song.song}</h3>
                    <p className="song-album">{song.album}</p>
                    <p className="song-artists">{song.primary_artists}</p>
                    <div className="song-meta">
                      <span>{formatDuration(song.duration)}</span>
                      {song.language && (
                        <span className="song-language">{song.language}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {songs.length > 0 && (
        <div className="pagination-info">
          <p>
            Showing {paginatedSongs.length} of {totalSongs} songs
          </p>
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={Math.ceil(songs.length / itemsPerPage)}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
            previousClassName="page-item"
            nextClassName="page-item"
            pageClassName="page-item"
            breakClassName="page-item"
            disabledClassName="disabled"
          />
        </div>
      )}

      {currentSong && (
        <div className="player-bar">
          <div className="player-left">
            <img
              src={currentSong.image}
              alt={currentSong.song}
              className="player-image"
            />
            <div className="player-info">
              <h4>{currentSong.song}</h4>
              <p>{currentSong.primary_artists}</p>
            </div>
          </div>
          <div className="player-center">
            <div className="player-controls">
              <div className="control-buttons">
                <button className="control-button" title="Shuffle">
                  <BiShuffle size={16} />
                </button>
                <button className="control-button" title="Previous">
                  <BsSkipStartFill size={20} />
                </button>
                <button
                  className="control-button play-button"
                  onClick={togglePlay}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <BsPauseFill size={20} />
                  ) : (
                    <BsPlayFill size={20} />
                  )}
                </button>
                <button className="control-button" title="Next">
                  <BsSkipEndFill size={20} />
                </button>
                <button className="control-button" title="Repeat">
                  <BiRepeat size={16} />
                </button>
              </div>
              <div className="playback-controls">
                <span className="time">{formatDuration(currentTime)}</span>
                <div className="progress-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    className="progress-bar"
                    onChange={handleSeek}
                    onMouseMove={handleProgressHover}
                    title={formatDuration(currentTime)}
                  />
                </div>
                <span className="time">
                  {formatDuration(currentSong.duration)}
                </span>
              </div>
            </div>
          </div>
          <div className="player-right">
            <button className="control-button" title="Queue">
              <MdOutlineQueueMusic size={20} />
            </button>
            <button
              className="volume-button"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <IoMdVolumeOff size={20} />
              ) : (
                <IoMdVolumeHigh size={20} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        className="audio-player"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
