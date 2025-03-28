import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { BsSearch, BsPlayFill, BsPauseFill, BsSkipStartFill, BsSkipEndFill } from 'react-icons/bs';
import { BiShuffle, BiRepeat } from 'react-icons/bi';
import { IoMdVolumeHigh, IoMdVolumeOff } from 'react-icons/io';
import { MdOutlineQueueMusic } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import "../../../styles/home.scss"

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalSongs, setTotalSongs] = useState(0);
  const audioRef = useRef(null);
  const itemsPerPage = 100;

  // Load some default songs on mount
  useEffect(() => {
    searchSongs('latest');
  }, []);

  const searchSongs = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://echozy-api.onrender.com/result/?query=${searchQuery}&limit=100`);
      const allSongs = Array.isArray(response.data) ? response.data : [response.data];
      setSongs(allSongs);
      setTotalSongs(allSongs.length);
    } catch (error) {
      console.error('Error fetching songs:', error);
      setSongs([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchSongs(query);
    }
  };

  const handleItemClick = (song) => {
    navigate(`/song/${encodeURIComponent(song.perma_url)}`);
  };

  const playSong = (song) => {
    handleItemClick(song);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    const audioElement = document.querySelector('.audio-player');
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
    const audioElement = document.querySelector('.audio-player');
    if (audioElement) {
      audioElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    const audioElement = document.querySelector('.audio-player');
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
    const position = ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
    e.currentTarget.title = formatDuration(position);
  };

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
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <div className="search-wrapper">
            <BsSearch className="search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for songs, albums, or artists..."
              className="search-input"
            />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <>
          <h2 className="section-title">Loading songs...</h2>
          <div className="songs-container">
            {Array(itemsPerPage).fill().map((_, index) => (
              <SongCardSkeleton key={index} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="section-title">Songs for you</h2>
          <div className="songs-container">
            {paginatedSongs.map((song, index) => (
              <div key={song.id || index} className="song-card" onClick={() => playSong(song)}>
                <div className="song-image-container">
                  <img src={song.image} alt={song.song} className="song-image" />
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
                    {song.language && <span className="song-language">{song.language}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {songs.length > 0 && (
        <div className="pagination-info">
          <p>Showing {paginatedSongs.length} of {totalSongs} songs</p>
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
            <img src={currentSong.image} alt={currentSong.song} className="player-image" />
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
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <BsPauseFill size={20} /> : <BsPlayFill size={20} />}
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
                <span className="time">{formatDuration(currentSong.duration)}</span>
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
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <IoMdVolumeOff size={20} /> : <IoMdVolumeHigh size={20} />}
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
    </div>
  );
}
