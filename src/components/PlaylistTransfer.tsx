import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const spotifyApi = new SpotifyWebApi();
const youtube = google.youtube('v3');

const PlaylistTransfer: React.FC = () => {
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferMessage, setTransferMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const spotifyToken = localStorage.getItem('bearer_access_token');
    const youtubeToken = localStorage.getItem('Bearer_access_token');

    if (!spotifyToken || !youtubeToken) {
      navigate('/');
      return;
    }

    spotifyApi.setAccessToken(spotifyToken);
    fetchSpotifyPlaylists();
  }, [navigate]);

  const fetchSpotifyPlaylists = async () => {
    try {
      const response = await spotifyApi.getUserPlaylists();
      setSpotifyPlaylists(response.items);
    } catch (error) {
      console.error('Error fetching Spotify playlists:', error);
    }
  };

  const handleTransfer = async () => {
    if (!selectedPlaylist) return;

    setIsTransferring(true);
    setTransferMessage('Transferring playlist...');

    try {
      // Fetch tracks from Spotify playlist
      const spotifyTracks = await spotifyApi.getPlaylistTracks(selectedPlaylist);

      // Create a new playlist on YouTube Music
      const youtubeToken = localStorage.getItem('Bearer_access_token');
      const auth = new OAuth2Client();
      auth.setCredentials({ access_token: youtubeToken });

      const newPlaylist = await youtube.playlists.insert({
        auth,
        part: ['snippet'],
        requestBody: {
          snippet: {
            title: 'Transferred from Spotify',
            description: 'This playlist was transferred from Spotify using our app.',
          },
        },
      });

      // Add tracks to the new YouTube Music playlist
      for (const item of spotifyTracks.items) {
        const track = item.track;
        const searchQuery = `${track.name} ${track.artists[0].name}`;
        
        const searchResponse = await youtube.search.list({
          auth,
          part: ['id'],
          q: searchQuery,
          type: ['video'],
          maxResults: 1,
        });

        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          const videoId = searchResponse.data.items[0].id?.videoId;
          if (videoId) {
            await youtube.playlistItems.insert({
              auth,
              part: ['snippet'],
              requestBody: {
                snippet: {
                  playlistId: newPlaylist.data.id,
                  resourceId: {
                    kind: 'youtube#video',
                    videoId: videoId,
                  },
                },
              },
            });
          }
        }
      }

      setTransferMessage('Playlist transferred successfully!');
    } catch (error) {
      console.error('Error transferring playlist:', error);
      setTransferMessage('Error transferring playlist. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Transfer Playlist</h2>
      <select
        value={selectedPlaylist}
        onChange={(e) => setSelectedPlaylist(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a Spotify playlist</option>
        {spotifyPlaylists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleTransfer}
        disabled={isTransferring || !selectedPlaylist}
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isTransferring ? 'Transferring...' : 'Transfer to YouTube Music'}
      </button>
      {transferMessage && (
        <p className="text-center text-green-600 font-semibold">{transferMessage}</p>
      )}
    </div>
  );
};

export default PlaylistTransfer;