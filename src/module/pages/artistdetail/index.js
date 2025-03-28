import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BsPlayFill } from 'react-icons/bs';
import '../../../styles/artistdetail.scss';

export default function Artistdetail() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const decodedId = decodeURIComponent(id);
        setLoading(true);
        
        // Use artist name to fetch their songs
        const response = await axios.get(`https://echozy-api.onrender.com/result/?query=${decodedId}&limit=50`);
        const allSongs = Array.isArray(response.data) ? response.data : [response.data];
        
        // Filter songs by exact artist name match
        const artistSongs = allSongs.filter(song => {
          const artistNames = song.primary_artists.split(', ');
          return artistNames.some(name => 
            name.toLowerCase() === decodedId.toLowerCase()
          );
        });

        if (artistSongs.length > 0) {
          const firstSong = artistSongs[0];
          const artistData = {
            name: decodedId, // Use the decoded name
            image: firstSong.image,
            description: `Featured artist with ${artistSongs.length} songs`,
            songs: artistSongs
          };
          
          setArtist(artistData);
          setSongs(artistSongs);
        }
      } catch (error) {
        console.error('Error fetching artist:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtist();
    }
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!artist) return <div className="error">Artist not found</div>;

  return (
    <div className="artist-detail-page">
      <div className="artist-header">
        <img src={artist.image} alt={artist.name} className="artist-image" />
        <div className="artist-info">
          <span className="type-label">Artist</span>
          <h1>{artist.name}</h1>
          <p className="artist-description">{artist.description}</p>
        </div>
      </div>

      <div className="artist-songs">
        <h2>Popular Songs</h2>
        <div className="songs-list">
          {songs.map((song, index) => (
            <Link 
              key={song.id || index} 
              to={`/song/${encodeURIComponent(song.perma_url)}`}
              className="song-item"
            >
              <div className="song-number">{index + 1}</div>
              <div className="song-info">
                <img src={song.image} alt={song.song} />
                <div className="song-details">
                  <h3>{song.song}</h3>
                  <p>{song.primary_artists}</p>
                </div>
              </div>
              <div className="song-duration">
                <BsPlayFill className="play-icon" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
