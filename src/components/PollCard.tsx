import { useState } from 'react';
import { ethers } from 'ethers';
import { Poll, PollStatus, PollSide } from '../types/poll';
import usePolls from '../hooks/usePolls';
import useWallet from '../hooks/useWallet';
import useContract from '../hooks/useContract'; // Import useContract
import { ClockIcon, CheckCircleIcon, XCircleIcon, CurrencyDollarIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

interface PollCardProps {
    poll: Poll;
}

const PollCard = ({ poll }: PollCardProps) => {
    const contract = useContract(); // Get the contract to check its availability
    const { predict, resolvePoll, claim, loading } = usePolls();
    const { address, isConnected } = useWallet(); // Get wallet connection status
    const [amount, setAmount] = useState('0.01');
    const [error, setError] = useState('');

    const handlePredict = async (side: PollSide) => {
        setError('');
        try {
            await predict(poll.id, side, amount);
        } catch (e: any) {
            setError(e.message || 'Prediction failed.');
        }
    };

    const handleResolve = async (outcome: PollSide) => {
        setError('');
        try {
            await resolvePoll(poll.id, outcome);
        } catch (e: any) {
            setError(e.message || 'Resolution failed.');
        }
    };
    
    const handleClaim = async () => {
        setError('');
        try {
            await claim(poll.id);
        } catch (e: any) {
            setError(e.message || 'Claim failed.');
        }
    };

    // Determine if the action buttons should be disabled
    const actionsDisabled = loading || !isConnected || !contract;

    const isPollOpen = poll.status === PollStatus.OPEN;
    const isResolved = poll.status === PollStatus.RESOLVED;
    const isCreator = address?.toLowerCase() === poll.creator.toLowerCase();
    const canResolve = isPollOpen && new Date() > poll.resolveTime;

    const renderStatus = () => {
        if (isResolved) {
            return (
                <div className="flex items-center space-x-2 text-lg font-bold">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                    <span className="text-green-400">Resolved:</span>
                    <span className={poll.outcome === PollSide.YES ? 'text-green-400' : 'text-red-400'}>
                        {poll.outcome === PollSide.YES ? 'YES' : 'NO'}
                    </span>
                </div>
            );
        }
        return (
            <div className="flex items-center space-x-2 text-lg font-bold text-yellow-400">
                 <CubeTransparentIcon className="h-6 w-6" /><span>Open</span>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-indigo-500/30 hover:border-indigo-500">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white pr-4" style={{ fontFamily: `'Orbitron', sans-serif` }}>{poll.question}</h3>
                    <div className="flex-shrink-0">{renderStatus()}</div>
                </div>

                <div className="text-sm text-gray-400 space-y-2 mb-6">
                     <div className="flex items-center"><ClockIcon className="h-4 w-4 mr-2" /><span>Ends: {poll.deadline.toLocaleString()}</span></div>
                     <div className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" /><span>Resolves: {poll.resolveTime.toLocaleString()}</span></div>
                </div>

                <div className="flex justify-between items-center mb-4 text-white">
                    <div className="text-center">
                        <p className="font-bold text-green-400 text-lg">YES</p>
                        <p>{poll.yesStaked} ETH</p>
                    </div>
                     <div className="text-center">
                        <p className="font-bold text-gray-400 text-lg">Total Staked</p>
                        <p>{poll.totalStaked} ETH</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-red-400 text-lg">NO</p>
                        <p>{poll.noStaked} ETH</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                 {isPollOpen && new Date() < poll.deadline && (
                    <div className="mt-4">
                        <label htmlFor={`amount-${poll.id}`} className="block text-sm font-medium text-gray-300 mb-2">Stake Amount (ETH)</label>
                        <input 
                            type="text" 
                            id={`amount-${poll.id}`} 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="flex justify-between mt-2 space-x-2">
                            <button onClick={() => handlePredict(PollSide.YES)} disabled={actionsDisabled} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                                Predict YES
                            </button>
                            <button onClick={() => handlePredict(PollSide.NO)} disabled={actionsDisabled} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                                Predict NO
                            </button>
                        </div>
                    </div>
                )}

                {isCreator && canResolve && (
                     <div className="mt-4 border-t border-gray-700 pt-4">
                        <h4 className="font-bold text-center text-white mb-2">Resolve Poll</h4>
                        <div className="flex justify-between space-x-2">
                            <button onClick={() => handleResolve(PollSide.YES)} disabled={actionsDisabled} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                                Resolve as YES
                            </button>
                            <button onClick={() => handleResolve(PollSide.NO)} disabled={actionsDisabled} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                                Resolve as NO
                            </button>
                        </div>
                    </div>
                )}
                
                {isResolved && (
                    <div className="mt-4">
                        <button onClick={handleClaim} disabled={actionsDisabled} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center">
                           <CurrencyDollarIcon className="h-5 w-5 mr-2"/> Claim Winnings
                        </button>
                    </div>
                )}

                {loading && <p className="text-center text-indigo-400 mt-2">Processing transaction...</p>}
                {error && <p className="text-center text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default PollCard;
