import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import CreatePoll from '../components/CreatePoll'; // Re-using the CreatePoll component for quick access

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
          Decentralized Prediction Markets
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Create prediction polls, predict outcomes, and earn rewards. Powered by Blockdags smart contracts for ultimate transparency and security.
        </p>

        <div className="flex justify-center gap-4 mb-16">
          <Link to="/polls">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
              Explore Prediction
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
              View My Dashboard
            </button>
          </Link>
        </div>

        {/* For convenience, we embed the poll creation form directly on the homepage */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">Or Create a Pprediction Right Now</h2>
          <CreatePoll />
        </div>

      </main>
        <footer className="bg-gray-800 text-center py-4 mt-16">
            <p className="text-gray-500">Built with React, Ethers.js, and Tailwind CSS.</p>
        </footer>
    </div>
  );
};

export default Home;
