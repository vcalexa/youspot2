import React from 'react';
import { Music, Youtube } from 'lucide-react';

const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const SPOTIFY_REDIRECT_URI = 'http://localhost:5173/callback';
const SPOTIFY_SCOPES = 'playlist-read-private playlist-read-collaborative';

const YOUTUBE_CLIENT_ID = 'YOUR_YOUTUBE_CLIENT_ID';
const YOUTUBE_REDIRECT_URI = 'http://localhost:5173/callback';
const YOUTUBE_SCOPES = 'https://www.googleapis.com/auth/youtube';

const Login: React.FC = () => {
  const handleSpotifyLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPES)}`;
    window.location.href = authUrl;
  };

  const handleYoutubeLogin = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${YOUTUBE_CLIENT_ID}&redirect_uri=${encodeURIComponent(YOUTUBE_REDIRECT_URI)}&response_type=token&scope=${encodeURIComponent(YOUTUBE_SCOPES)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Login to Services</h2>
      <button
        onClick={handleSpotifyLogin}
        className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
      >
        <Music size={24} />
        <span>Login to Spotify</span>
      </button>
      <button
        onClick={handleYoutubeLogin}
        className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
      >
        <Youtube size={24} />
        <span>Login to YouTube Music</span>
      </button>
    </div>
  );
};

export default Login;