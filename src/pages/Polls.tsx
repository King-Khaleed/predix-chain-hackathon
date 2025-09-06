import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import Header from '../components/Header';
import { getAllPolls } from '../utils/web3';
import useContract from '../hooks/useContract';

// NOTE: As requested, PollCard is defined within this file.
const PollCard = ({ poll }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return 'Open';
      case 1: return 'Resolved (Yes)';
      case 2: return 'Resolved (No)';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white transform hover:-translate-y-1 transition-transform duration-300">
      <h3 className="text-xl font-bold mb-2 truncate">{poll.question}</h3>
      <div className="space-y-2 text-sm text-gray-400">
        <p>
          <span className="font-semibold">Status: </span>
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            poll.status === 0 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            {getStatusLabel(poll.status)}
          </span>
        </p>
        <p><span className="font-semibold">Total Staked:</span> {poll.totalStaked} ETH</p>
        <p><span className="font-semibold">Prediction Deadline:</span> {format(new Date(poll.deadline * 1000), 'PPpp')}</p>
      </div>
    </div>
  );
};

const Polls = () => {
  const { provider } = useContract();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pollsPerPage = 20;

  useEffect(() => {
    const fetchPolls = async () => {
      if (!provider) return;
      setLoading(true);
      try {
        const pollsData = await getAllPolls(provider);
        setPolls(pollsData.sort((a, b) => b.id - a.id)); // Show newest first
      } catch (error) {
        console.error("Failed to fetch polls:", error);
        toast.error('Failed to load polls. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, [provider]);

  const filteredPolls = useMemo(() => {
    return polls
      .filter(poll => {
        if (filter === 'Open') return poll.status === 0;
        if (filter === 'Resolved') return poll.status === 1 || poll.status === 2;
        return true;
      })
      .filter(poll => poll.question.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [polls, filter, searchTerm]);

  const paginatedPolls = useMemo(() => {
    const startIndex = (currentPage - 1) * pollsPerPage;
    return filteredPolls.slice(startIndex, startIndex + pollsPerPage);
  }, [filteredPolls, currentPage]);

  const totalPages = Math.ceil(filteredPolls.length / pollsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold">Polls</h1>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center mb-8 border-b border-gray-700">
          {['All', 'Open', 'Resolved'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 font-semibold transition-colors duration-300 ${
                filter === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : paginatedPolls.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedPolls.map(poll => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-16">No polls found.</p>
        )}
      </main>
    </div>
  );
};

export default Polls;
