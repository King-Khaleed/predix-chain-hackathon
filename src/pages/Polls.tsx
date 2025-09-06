import React, { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import { getAllPolls } from '../utils/web3';
import useWallet from '../hooks/useWallet';
import PollCard, { Poll } from '../components/PollCard';
import VoteModal from '../components/VoteModal'; // Import the modal

const Polls = () => {
  const { provider } = useWallet();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pollsPerPage = 20;

  // State for the modal
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      const readProvider = provider || new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      setLoading(true);
      try {
        const pollsData = await getAllPolls(readProvider);
        setPolls(pollsData.sort((a, b) => b.id - a.id));
      } catch (error) {
        console.error("Failed to fetch polls:", error);
        toast.error('Failed to load polls. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, [provider]);

  const filteredPolls = useMemo(() => {
    setCurrentPage(1);
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

  const handlePollClick = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsVoteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsVoteModalOpen(false);
    setSelectedPoll(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
          {/* ... UI for filtering and search ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedPolls.map(poll => (
                <div key={poll.id} onClick={() => handlePollClick(poll)} className="cursor-pointer">
                    <PollCard poll={poll} />
                </div>
            ))}
        </div>
          {/* ... UI for pagination ... */}
      </main>

      {selectedPoll && (
        <VoteModal
          poll={selectedPoll}
          isOpen={isVoteModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Polls;
