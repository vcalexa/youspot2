import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import PlaylistTransfer from './components/PlaylistTransfer';
import Callback from './components/Callback';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center p-4">
        <Header />
        <main className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/transfer" element={<PlaylistTransfer />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;