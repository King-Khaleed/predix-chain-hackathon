import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import { getAllPolls, getReadOnlyProvider } from '../utils/web3';
import useWallet from '../hooks/useWallet';
import PollCard, { Poll } from '../components/PollCard';

const Polls = () => {
  const { provider } = useWallet();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pollsPerPage = 9;

  const fetchPolls = useCallback(async () => {
    // No need to show loader on manual refresh
    const readProvider = provider || getReadOnlyProvider();
    try {
      const pollsData = await getAllPolls(readProvider);
      setPolls(pollsData.sort((a, b) => b.id - a.id)); // Sort by newest first
    } catch (error) {
      console.error("Failed to fetch polls:", error);
      toast.error('Failed to load polls. Please check your connection.');
    }
  }, [provider]);

  useEffect(() => {
    setLoading(true);
    fetchPolls().finally(() => setLoading(false));
  }, [fetchPolls]);

  const handlePollUpdate = () => {
    // Add a small delay to allow blockchain to update
    setTimeout(() => fetchPolls(), 1000);
  };

  const filteredPolls = useMemo(() => {
    setCurrentPage(1); // Reset to first page on filter change
    return polls
      .filter(poll => {
        if (filter === 'Open') return poll.status === 0;
        if (filter === 'Resolved') return poll.status !== 0;
        return true;
      })
      .filter(poll => poll.question.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [polls, filter, searchTerm]);

  const paginatedPolls = useMemo(() => {
    const startIndex = (currentPage - 1) * pollsPerPage;
    return filteredPolls.slice(startIndex, startIndex + pollsPerPage);
  }, [filteredPolls, currentPage, pollsPerPage]);

  const totalPages = Math.ceil(filteredPolls.length / pollsPerPage);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
            {/* Filter and search UI */}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPolls.map(poll => (
                <PollCard key={poll.id} poll={poll} onPollUpdate={handlePollUpdate} />
            ))}
          </div>
        )}

        {/* Pagination UI */}
        
      </main>
    </div>
  );
};

export default Polls;
