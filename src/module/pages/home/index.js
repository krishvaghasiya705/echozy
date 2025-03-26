import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { fetchUserTopTracks, fetchRecommendations, fetchGlobalCharts } from "../../../spotifyApi";
import { setCurrentTrack, setIsPlaying } from "../../../store/playerSlice";
import "../../../styles/home.scss";

const Home = ({ token }) => {
  const [topTracks, setTopTracks] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let [top, recommended, releases] = await Promise.all([
          fetchUserTopTracks(token),
          fetchRecommendations(token),
          fetchGlobalCharts(token)
        ]);

        // Filter out any null or undefined results
        top = top || [];
        recommended = recommended || [];
        releases = releases || [];

        // Only show sections that have data
        if (top.length > 0) setTopTracks(top);
        if (recommended.length > 0) setRecommendedTracks(recommended);
        if (releases.length > 0) setNewReleases(releases);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load music data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function to stop audio when component unmounts
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
    };
  }, [token]);

  const playTrack = (track) => {
    dispatch(setCurrentTrack(track));
    dispatch(setIsPlaying(true));
  };

  const TrackList = ({ tracks, title }) => (
    <div className="track-section">
      <h2>{title}</h2>
      <div className="tracks-grid">
        {Array.isArray(tracks) && tracks.map((track) => {
          // Handle both album and track objects
          const trackData = track.type === 'album' ? {
            id: track.id,
            name: track.name,
            artists: track.artists,
            images: track.images,
            preview_url: track.preview_url
          } : track;

          return (
            <div 
              key={`${title}-${trackData.id}`}
              className="track-card"
              onClick={() => trackData.preview_url && playTrack(trackData)}
            >
              <img 
                src={trackData.images?.[0]?.url || trackData.album?.images?.[0]?.url} 
                alt={trackData.name}
              />
              <div className="track-info">
                <h3>{trackData.name}</h3>
                <p>{trackData.artists?.map(artist => artist.name).join(', ')}</p>
              </div>
              {trackData.preview_url && (
                <button className="play-button">▶</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (isLoading) {
    return <div className="loading">Loading your music...</div>;
  }

  return (
    <div className="home">
      <h1>Your Music Hub</h1>
      {token ? (
        <>
          <TrackList tracks={topTracks} title="Your Top Tracks" />
          <TrackList tracks={recommendedTracks} title="Recommended for You" />
          <TrackList tracks={newReleases} title="New Releases" />
        </>
      ) : (
        <p>Please log in to see your music.</p>
      )}
    </div>
  );
};

export default Home;
