import React from 'react'
import { Music, Youtube } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-white mb-2">Playlist Transfer</h1>
      <div className="flex items-center justify-center space-x-2">
        <Music className="text-green-400" size={32} />
        <span className="text-white text-2xl">&rarr;</span>
        <Youtube className="text-red-500" size={32} />
      </div>
      <p className="text-white mt-2">Spotify to YouTube Music</p>
    </header>
  )
}

export default Header