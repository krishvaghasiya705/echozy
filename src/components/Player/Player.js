import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsPlaying, setCurrentTrack } from '../../store/playerSlice';
import './Player.scss';

const Player = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const { currentTrack, isPlaying, volume } = useSelector(state => state.player);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
          dispatch(setIsPlaying(false));
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;

      const handleEnded = () => {
        dispatch(setIsPlaying(false));
        setCurrentTime(0);
      };

      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [volume, dispatch]);

  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleClose = () => {
    dispatch(setCurrentTrack(null));
    dispatch(setIsPlaying(false));
  };

  if (!currentTrack) return null;

  return (
    <div className="player">
      <audio
        ref={audioRef}
        src={currentTrack.preview_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => dispatch(setIsPlaying(false))}
      />
      
      <div className="player-left">
        <img src={currentTrack.album?.images[0].url} alt={currentTrack.name} />
        <div className="track-info">
          <h4>{currentTrack.name}</h4>
          <p>{currentTrack.artists?.map(artist => artist.name).join(', ')}</p>
        </div>
      </div>

      <div className="player-center">
        <div className="controls">
          <button className="control-button" onClick={handlePlayPause}>
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="30"
            value={currentTime}
            onChange={handleProgressChange}
            className="progress-bar"
          />
          <span className="time">0:30</span>
        </div>
      </div>

      <div className="player-right">
        <button className="close-button" onClick={handleClose}>✕</button>
      </div>
    </div>
  );
};

export default Player;
