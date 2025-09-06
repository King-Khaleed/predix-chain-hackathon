import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import { getPoll, getReadOnlyProvider } from '../utils/web3';
import useWallet from '../hooks/useWallet';
import useContract from '../hooks/useContract';
import PollCard, { Poll } from '../components/PollCard';

const Dashboard = () => {
  const { address: userAddress, isConnected } = useWallet();
  const contract = useContract();
  const [createdPolls, setCreatedPolls] = useState<Poll[]>([]);
  const [predictedPolls, setPredictedPolls] = useState<Poll[]>([]);
  const [loadingCreated, setLoadingCreated] = useState(false);
  const [loadingPredicted, setLoadingPredicted] = useState(false);

  const fetchCreatedPolls = useCallback(async () => {
    if (!contract || !userAddress) return;
    setLoadingCreated(true);
    try {
      const provider = getReadOnlyProvider();
      // This filter requires the `creator` parameter to be indexed in the event
      const filter = contract.filters.PollCreated(userAddress);
      const logs = await contract.queryFilter(filter);
      const pollIds = logs.map((log: any) => log.args.pollId); // Assuming event signature is event PollCreated(uint256 pollId, address indexed creator);
      const polls = await Promise.all(pollIds.map((id: number) => getPoll(provider, id)));
      setCreatedPolls(polls.filter((p): p is Poll => p !== null));
    } catch (error) {
      console.error("Failed to fetch created polls:", error);
      toast.error('Could not load your created polls. The ABI might be missing event definitions.');
    } finally {
      setLoadingCreated(false);
    }
  }, [contract, userAddress]);

  const fetchPredictedPolls = useCallback(async () => {
    if (!contract || !userAddress) return;
    setLoadingPredicted(true);
    try {
      const provider = getReadOnlyProvider();
      // This filter requires the `voter` parameter to be indexed in the event
      const filter = contract.filters.Predicted(null, userAddress);
      const logs = await contract.queryFilter(filter);
      const pollIds = [...new Set(logs.map((log: any) => log.args.pollId))]; // Assuming event signature is event Predicted(uint256 pollId, address indexed voter, ...)
      const polls = await Promise.all(pollIds.map((id: number) => getPoll(provider, id)));
      setPredictedPolls(polls.filter((p): p is Poll => p !== null));
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
      toast.error('Could not load your predictions. The ABI might be missing event definitions.');
    } finally {
      setLoadingPredicted(false);
    }
  }, [contract, userAddress]);

  const handlePollUpdate = useCallback(() => {
    fetchCreatedPolls();
    fetchPredictedPolls();
  }, [fetchCreatedPolls, fetchPredictedPolls]);

  useEffect(() => {
    if (isConnected) {
      handlePollUpdate();
    }
  }, [isConnected, handlePollUpdate]);

  const renderPollList = (polls: Poll[], loading: boolean, emptyMessage: string) => {
    if (!isConnected) {
        return <p className="text-center text-gray-500 italic">Please connect your wallet to view your dashboard.</p>;
    }
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }
    if (polls.length === 0) {
      return <p className="text-center text-gray-500 italic">{emptyMessage}</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map(poll => <PollCard key={poll.id} poll={poll} onPollUpdate={handlePollUpdate} />)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">My Created Polls</h2>
          {renderPollList(createdPolls, loadingCreated, "You haven't created any polls yet, or we couldn't load them.")}
        </section>
        <section>
          <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">My Predictions</h2>
          {renderPollList(predictedPolls, loadingPredicted, "You haven't made any predictions yet, or we couldn't load them.")}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
