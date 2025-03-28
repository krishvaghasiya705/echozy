import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsPlayFill } from 'react-icons/bs';
import '../../../styles/search.scss';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://echozy-api.onrender.com/result/?query=${query}&limit=100`);
      setResults(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    }
    setLoading(false);
  };

  const filterResults = () => {
    switch (activeTab) {
      case 'songs':
        return results.filter(item => item.type === 'song');
      case 'albums':
        return results.filter(item => item.type === 'album');
      case 'artists':
        return results.filter(item => item.type === 'artist');
      default:
        return results;
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'song' || !item.type) {
      navigate(`/song/${encodeURIComponent(item.perma_url)}`);
    } else if (item.type === 'album') {
      navigate(`/album/${encodeURIComponent(item.perma_url)}`);
    }
  };

  return (
    <div className="search-results">
      <div className="search-header">
        <h1>Search Results for "{searchParams.get('q')}"</h1>
        <div className="search-tabs">
          <button 
            className={activeTab === 'all' ? 'active' : ''} 
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={activeTab === 'songs' ? 'active' : ''} 
            onClick={() => setActiveTab('songs')}
          >
            Songs
          </button>
          <button 
            className={activeTab === 'albums' ? 'active' : ''} 
            onClick={() => setActiveTab('albums')}
          >
            Albums
          </button>
          <button 
            className={activeTab === 'artists' ? 'active' : ''} 
            onClick={() => setActiveTab('artists')}
          >
            Artists
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Searching...</div>
      ) : (
        <div className="results-grid">
          {filterResults().map((item, index) => (
            <div 
              key={item.id || index} 
              className="result-card"
              onClick={() => handleItemClick(item)}
            >
              <div className="result-image">
                <img src={item.image} alt={item.title || item.song} />
                <button className="play-button">
                  <BsPlayFill size={24} />
                </button>
              </div>
              <div className="result-info">
                <h3>{item.title || item.song}</h3>
                <p>{item.primary_artists || item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
