import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './contexts/WalletContext';
import LandingPage from './pages/LandingPage';
import Polls from './pages/Polls';
import Dashboard from './pages/Dashboard';
import CreatePoll from './pages/CreatePoll'; // Import the CreatePoll page
import NavBar from './components/NavBar'; // Import the NavBar
import PollDetailPage from './pages/PollDetailPage';

function App() {
  return (
    <WalletProvider>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      {/* The NavBar will now be persistent and manage wallet state globally */}
      <NavBar /> 

      {/* Add padding to the main content to prevent overlap with the fixed NavBar */}
      <main className="pt-24 bg-gray-900 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<PollDetailPage />} />
        </Routes>
      </main>
    </WalletProvider>
  );
}

export default App;
