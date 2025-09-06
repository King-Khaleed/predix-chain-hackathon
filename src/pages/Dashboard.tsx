import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import Header from '../components/Header';
import { getContract, getPoll } from '../utils/web3';
import useContract from '../hooks/useContract';

// As requested, PollCard is defined here to keep changes within this file.
const PollCard = ({ poll }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return 'Open';
      case 1: return 'Resolved (Yes)';
      case 2: return 'Resolved (No)';
      default: return 'Unknown';
    }
  };

  if (!poll) {
    return null; // Or a placeholder for a poll that couldn't be fetched
  }

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
        <p><span className="font-semibold">Prediction Deadline:</span> {poll.deadline ? format(new Date(poll.deadline * 1000), 'PPpp') : 'N/A'}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { provider, address: userAddress } = useContract();
  const [createdPolls, setCreatedPolls] = useState([]);
  const [predictedPolls, setPredictedPolls] = useState([]);
  const [loadingCreated, setLoadingCreated] = useState(false);
  const [loadingPredicted, setLoadingPredicted] = useState(false);

  useEffect(() => {
    if (!provider || !userAddress) return;

    const fetchCreatedPolls = async () => {
      setLoadingCreated(true);
      try {
        const contract = getContract(provider);
        // Per instructions, filter PollCreated by user address.
        // This assumes the event is `PollCreated(address indexed creator, ...)`
        const filter = contract.filters.PollCreated(userAddress);
        const logs = await contract.queryFilter(filter);
        const pollIds = logs.map(log => log.args.id);
        const polls = await Promise.all(pollIds.map(id => getPoll(provider, id)));
        setCreatedPolls(polls.filter(p => p)); // Filter out any nulls from failed fetches
      } catch (error) {
        console.error("Failed to fetch created polls:", error);
        toast.error('Could not load your created polls.');
      } finally {
        setLoadingCreated(false);
      }
    };

    const fetchPredictedPolls = async () => {
      setLoadingPredicted(true);
      try {
        const contract = getContract(provider);
        // Per instructions, filter Predicted by user address.
        // Event: `Predicted(uint256 indexed pollId, address indexed user, ...)`
        const filter = contract.filters.Predicted(null, userAddress);
        const logs = await contract.queryFilter(filter);
        // Get unique poll IDs to avoid duplicates
        const pollIds = [...new Set(logs.map(log => log.args.pollId))];
        const polls = await Promise.all(pollIds.map(id => getPoll(provider, id)));
        setPredictedPolls(polls.filter(p => p)); // Filter out any nulls
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
        toast.error('Could not load your predictions.');
      } finally {
        setLoadingPredicted(false);
      }
    };

    fetchCreatedPolls();
    fetchPredictedPolls();

  }, [provider, userAddress]);

  const renderPollList = (polls, loading, emptyMessage) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    if (polls.length === 0) {
      return <p className="text-gray-500 italic">{emptyMessage}</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map(poll => <PollCard key={poll.id} poll={poll} />)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">My Created Polls</h2>
          {renderPollList(createdPolls, loadingCreated, "You haven't created any polls yet.")}
        </section>
        <section>
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">My Predictions</h2>
          {renderPollList(predictedPolls, loadingPredicted, "You haven't made any predictions yet.")}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
