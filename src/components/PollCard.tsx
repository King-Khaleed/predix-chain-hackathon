import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatEther } from 'ethers';

import useWallet from '../hooks/useWallet';
import { getReadOnlyProvider, getUserPrediction, getHasClaimed, claim } from '../utils/web3';
import VoteModal from './VoteModal';
import ResolutionModal from './ResolutionModal';

export interface Poll {
  id: number;
  question: string;
  creator: string;
  deadline: number;
  resolveTime: number;
  totalStaked: bigint;
  yesStaked: bigint;
  noStaked: bigint;
  status: number; // 0: Open, 1: Resolved (Yes), 2: Resolved (No)
}

interface PollCardProps {
  poll: Poll;
  onPollUpdate: () => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onPollUpdate }) => {
  const { address, signer } = useWallet();
  const [isVoteModalOpen, setVoteModalOpen] = useState(false);
  const [isResolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState({ canClaim: false, isClaiming: false });

  useEffect(() => {
    const checkClaimStatus = async () => {
      if (poll.status === 0 || !address) return;

      const provider = getReadOnlyProvider();
      const prediction = await getUserPrediction(provider, poll.id, address);
      if (!prediction) return; // User didn't vote on this poll

      const hasClaimed = await getHasClaimed(provider, poll.id, address);
      if (hasClaimed) return; // Already claimed

      // Check if user voted on the winning side
      const won = (poll.status === 1 && prediction.side === true) || (poll.status === 2 && prediction.side === false);

      if (won) {
        setClaimStatus({ canClaim: true, isClaiming: false });
      }
    };

    checkClaimStatus();
  }, [poll.id, poll.status, address]);

  const getStatusLabel = (status: number) => {
    // ... (same as before)
  };

  const isCreator = address && poll.creator && address.toLowerCase() === poll.creator.toLowerCase();
  const now = Date.now() / 1000;
  const canVote = poll.status === 0 && now < poll.deadline;
  const canResolve = poll.status === 0 && now > poll.resolveTime;

  const handleClaim = async () => {
    if (!signer) return;
    setClaimStatus({ ...claimStatus, isClaiming: true });
    try {
      await claim(signer, poll.id);
      onPollUpdate(); // Refresh the polls
      setClaimStatus({ canClaim: false, isClaiming: false }); // Update status after claim
    } catch (error) {
      console.error("Failed to claim winnings:", error);
      setClaimStatus({ ...claimStatus, isClaiming: false });
    }
  };
  
    const handleResolutionSuccess = () => {
    setResolutionModalOpen(false);
    onPollUpdate();
  }


  // ... (JSX remains similar, with updated button logic)

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white flex flex-col justify-between min-h-[280px] transform hover:-translate-y-1 transition-transform duration-300">
      {/* ... (rest of the JSX) */}
      <div className="mt-4 flex flex-wrap gap-2 justify-end">
        {canVote && <button onClick={() => setVoteModalOpen(true)} className="... ">Vote</button>}
        {isCreator && canResolve && <button onClick={() => setResolutionModalOpen(true)} className="... ">Resolve</button>}
        {claimStatus.canClaim && (
          <button 
            onClick={handleClaim}
            disabled={claimStatus.isClaiming}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-500">
            {claimStatus.isClaiming ? 'Claiming...' : 'Claim Winnings'}
          </button>
        )}
      </div>
      <VoteModal pollId={poll.id} isOpen={isVoteModalOpen} onClose={() => setVoteModalOpen(false)} onVoteSuccess={onPollUpdate} />
      <ResolutionModal pollId={poll.id} isOpen={isResolutionModalOpen} onClose={handleResolutionSuccess} />
    </div>
  );
};

export default PollCard;
