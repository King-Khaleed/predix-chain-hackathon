import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import { getPoll } from '../utils/web3';
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

  useEffect(() => {
    if (!contract || !userAddress || !isConnected) return;

    const fetchCreatedPolls = async () => {
      setLoadingCreated(true);
      try {
        const filter = contract.filters.PollCreated(userAddress);
        const logs = await contract.queryFilter(filter);
        const pollIds = logs.map(log => log.args.id);
        const polls = await Promise.all(pollIds.map(id => getPoll(contract.provider, id)));
        setCreatedPolls(polls.filter((p): p is Poll => p !== null));
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
        const filter = contract.filters.Predicted(null, userAddress);
        const logs = await contract.queryFilter(filter);
        const pollIds = [...new Set(logs.map(log => log.args.pollId))];
        const polls = await Promise.all(pollIds.map(id => getPoll(contract.provider, id)));
        setPredictedPolls(polls.filter((p): p is Poll => p !== null));
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
        toast.error('Could not load your predictions.');
      } finally {
        setLoadingPredicted(false);
      }
    };

    fetchCreatedPolls();
    fetchPredictedPolls();

  }, [contract, userAddress, isConnected]);

  const renderPollList = (polls: Poll[], loading: boolean, emptyMessage: string) => {
    if (!isConnected) {
        return <p className="text-center text-gray-500 italic">Please connect your wallet to view your dashboard.</p>;
    }
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
