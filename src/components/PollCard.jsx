import { useState } from 'react';
import { ethers } from 'ethers';
import { format } from 'date-fns';
import useContract from '../hooks/useContract';
import ResolutionModal from './ResolutionModal';

const PollCard = ({ poll, userAddress }) => {
  const { makePrediction, claimReward } = useContract();
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePredict = async (side) => {
    if (!amount) {
      alert('Please enter an amount to stake.');
      return;
    }
    try {
      await makePrediction(poll.id, side, amount);
      alert('Prediction successful!');
    } catch (error) {
      alert(`Prediction failed: ${error.message}`);
    }
  };

  const handleClaim = async () => {
    try {
      await claimReward(poll.id);
      alert('Reward claimed successfully!');
    } catch (error) {
      alert(`Failed to claim reward: ${error.message}`);
    }
  };

  const isOwner = userAddress && poll.creator && userAddress.toLowerCase() === poll.creator.toLowerCase();

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 mb-4">
      <h3 className="text-xl font-bold mb-2">{poll.question}</h3>
      <p>Status: {poll.status === 0 ? 'Open' : poll.status === 1 ? 'Resolved' : 'Cancelled'}</p>
      <p>Deadline: {format(new Date(poll.deadline * 1000), 'PPpp')}</p>
      <p>Resolve Time: {format(new Date(poll.resolveTime * 1000), 'PPpp')}</p>
      <p>Total Staked: {poll.totalStaked} tDAG</p>
      <div className="flex justify-between mt-4">
        <div>
          <p>Yes: {poll.yesStaked} tDAG</p>
          <p>No: {poll.noStaked} tDAG</p>
        </div>
        {poll.status === 0 && (
          <div className="flex items-center">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount in tDAG"
              className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 mr-2"
            />
            <button onClick={() => handlePredict(1)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded mr-2">Predict Yes</button>
            <button onClick={() => handlePredict(0)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded">Predict No</button>
          </div>
        )}
      </div>
      {poll.status === 1 && (
        <button onClick={handleClaim} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Claim Reward
        </button>
      )}
      {isOwner && poll.status === 0 && Date.now() / 1000 > poll.resolveTime && (
        <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
          Resolve Poll
        </button>
      )}
      <ResolutionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pollId={poll.id}
      />
    </div>
  );
};

export default PollCard;
