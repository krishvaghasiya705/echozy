import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BsPlayFill, BsPauseFill, BsThreeDots } from 'react-icons/bs';
import { AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai';
import { BiShuffle, BiRepeat } from 'react-icons/bi';
import { BsSkipStartFill, BsSkipEndFill } from 'react-icons/bs';
import { IoMdVolumeHigh, IoMdVolumeOff } from 'react-icons/io';
import '../../../styles/songdetail.scss';

export default function Songdetail() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    if (id) {
      const fetchSong = async () => {
        try {
          const decodedId = decodeURIComponent(id);
          setLoading(true);
          const response = await axios.get(`https://echozy-api.onrender.com/song/?query=${decodedId}`);
          setSong(response.data);
          
          // Store in recent plays
          const recentPlays = JSON.parse(localStorage.getItem('recentPlays') || '[]');
          const updatedRecent = [response.data, ...recentPlays.filter(s => s.id !== response.data.id)].slice(0, 10);
          localStorage.setItem('recentPlays', JSON.stringify(updatedRecent));
        } catch (error) {
          console.error('Error fetching song:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSong();
      
      // Store ref in variable for cleanup
      const currentAudioRef = audioRef.current;
      return () => {
        if (currentAudioRef) {
          currentAudioRef.pause();
          currentAudioRef.src = '';
        }
      };
    }
  }, [id]);

  useEffect(() => {
    if (song?.media_url && audioRef.current) {
      audioRef.current.src = song.media_url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      }
    }
  }, [song, isPlaying]);

  useEffect(() => {
    // Initialize volume and slider on mount
    if (audioRef.current) {
      audioRef.current.volume = volume;
      const volumeSlider = document.querySelector('.volume-slider');
      if (volumeSlider) {
        volumeSlider.style.setProperty('--volume-percentage', `${volume * 100}%`);
      }
    }
  }, [audioRef, volume]); // Added volume to dependency array

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      const newVolume = newMutedState ? 0 : (volume || 1);
      setVolume(newVolume);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!song) return <div className="error">Song not found</div>;

  return (
    <div className="song-detail-page">
      <div className="header-gradient">
        <div className="song-header">
          <img src={song.image} alt={song.song} className="song-cover" />
          <div className="song-info">
            <span className="type-label">Song</span>
            <h1>{song.song}</h1>
            <div className="meta-info">
              <img src={song.image} alt={song.primary_artists} />
              <Link 
                to={`/artist/${encodeURIComponent(song.primary_artists_id)}`}
                className="artist-name"
              >
                {song.primary_artists}
              </Link>
              <span className="dot">•</span>
              <span className="song-year">{new Date().getFullYear()}</span>
              <span className="dot">•</span>
              <span className="duration">{formatDuration(song.duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="player-section">
        <div className="player-content">
          <div className="main-controls">
            <button className="play-pause-button" onClick={togglePlay}>
              {isPlaying ? <BsPauseFill size={28} /> : <BsPlayFill size={28} />}
            </button>
            <div className="action-buttons">
              <button className="like-button" title="Like">
                <AiOutlineHeart size={32} />
              </button>
              <button title="Download">
                <AiOutlineDownload size={32} />
              </button>
              <button title="More">
                <BsThreeDots size={32} />
              </button>
            </div>
          </div>

          <div className="playback-section">
            <div className="playback-controls">
              <button title="Shuffle">
                <BiShuffle size={20} />
              </button>
              <button title="Previous">
                <BsSkipStartFill size={24} />
              </button>
              <button className="play-button" onClick={togglePlay}>
                {isPlaying ? <BsPauseFill size={24} /> : <BsPlayFill size={24} />}
              </button>
              <button title="Next">
                <BsSkipEndFill size={24} />
              </button>
              <button title="Repeat">
                <BiRepeat size={20} />
              </button>
            </div>

            <div className="progress-section">
              <span className="time">{formatDuration(currentTime)}</span>
              <div className="progress-bar">
                <div 
                  className="progress-filled" 
                  style={{ width: `${progress}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                />
              </div>
              <span className="time">{formatDuration(song.duration)}</span>
            </div>

            <div className="extra-controls">
              <div className="volume-control">
                <button onClick={toggleMute}>
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
                />
              </div>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}
