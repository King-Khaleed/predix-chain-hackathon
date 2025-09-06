import React from 'react';
import { format } from 'date-fns';

// Defines the shape of a poll object for type consistency
export interface Poll {
  id: number;
  question: string;
  deadline: number;
  resolveTime: number;
  totalStaked: number;
  yesStaked: number;
  noStaked: number;
  status: number; // 0: Open, 1: Resolved (Yes), 2: Resolved (No)
  creator: string;
}

interface PollCardProps {
  poll: Poll;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return 'Open';
      case 1: return 'Resolved (Yes)';
      case 2: return 'Resolved (No)';
      default: return 'Unknown';
    }
  };

  if (!poll) {
    return null; // Don't render if poll data is missing
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white transform hover:-translate-y-1 transition-transform duration-300">
      <h3 className="text-xl font-bold mb-2 truncate" title={poll.question}>{poll.question}</h3>
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

export default PollCard;
