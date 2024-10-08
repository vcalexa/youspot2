import React from 'react'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'

interface TransferResultProps {
  status: 'success' | 'error'
  tracks: { title: string; artist: string }[]
  youtubePlaylistUrl: string | null
  onReset: () => void
}

const TransferResult: React.FC<TransferResultProps> = ({ status, tracks, youtubePlaylistUrl, onReset }) => {
  return (
    <div className="text-center">
      {status === 'success' ? (
        <>
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-green-700 mb-4">Transfer Completed Successfully!</h2>
          <p className="mb-4">The following tracks were transferred to YouTube Music:</p>
          <ul className="list-disc list-inside mb-6 text-left">
            {tracks.map((track, index) => (
              <li key={index} className="text-gray-700">{track.title} - {track.artist}</li>
            ))}
          </ul>
          {youtubePlaylistUrl && (
            <a 
              href={youtubePlaylistUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              View on YouTube Music
              <ExternalLink size={16} className="ml-1" />
            </a>
          )}
        </>
      ) : (
        <>
          <XCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-red-700 mb-4">Transfer Failed</h2>
          <p className="mb-6">An error occurred during the transfer process. Please try again.</p>
        </>
      )}
      <button
        onClick={onReset}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
      >
        Transfer Another Playlist
      </button>
    </div>
  )
}

export default TransferResult