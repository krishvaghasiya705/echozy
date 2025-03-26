const BASE_URL = "https://api.spotify.com/v1";

// Function to fetch Global Top Songs
export const fetchGlobalCharts = async (token) => {
  try {
    // Changed to New Releases instead of featured playlists since it's more reliable
    const response = await fetch(`${BASE_URL}/browse/new-releases`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return data.albums.items;
  } catch (error) {
    console.error("Error fetching charts:", error);
    return [];
  }
};

// Function to fetch songs from a playlist
export const fetchPlaylistTracks = async (playlistId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch playlist tracks");

    const data = await response.json();
    return data.items.map((item) => item.track);
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    return [];
  }
};

export const fetchUserTopTracks = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/me/top/tracks?limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch top tracks");
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return [];
  }
};

export const fetchRecentlyPlayed = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/me/player/recently-played?limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch recently played");
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching recently played:", error);
    return [];
  }
};

export const fetchRecommendations = async (token) => {
  try {
    // First try to get user's top tracks to use as seeds
    const topTracksResponse = await fetch(`${BASE_URL}/me/top/tracks?limit=2`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (topTracksResponse.ok) {
      const topTracks = await topTracksResponse.json();
      if (topTracks.items && topTracks.items.length > 0) {
        // Use top tracks and a single genre as seeds
        const seedTracks = topTracks.items.map(track => track.id).join(',');
        const response = await fetch(
          `${BASE_URL}/recommendations?seed_tracks=${seedTracks}&seed_genres=pop&limit=20`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data.tracks;
        }
      }
    }

    // If the above fails, try with just search
    const searchResponse = await fetch(
      `${BASE_URL}/search?q=year:2023&type=track&market=US&limit=20`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (searchResponse.ok) {
      const data = await searchResponse.json();
      return data.tracks.items;
    }

    // If everything fails, fallback to new releases
    return fetchGlobalCharts(token);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return fetchGlobalCharts(token);
  }
};
