import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Poll, PollStatus } from '../types/poll';
import usePolls from '../hooks/usePolls';
import useWallet from '../hooks/useWallet';
import { ethers } from 'ethers';

const PollDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getPoll, predict, loading: pollsLoading } = usePolls();
    const { address } = useWallet();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [stakeAmount, setStakeAmount] = useState('0.01');

    useEffect(() => {
        const fetchPoll = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const pollId = parseInt(id, 10);
                if (isNaN(pollId)) {
                    toast.error("Invalid Poll ID");
                    return;
                }
                const fetchedPoll = await getPoll(pollId);
                setPoll(fetchedPoll);
            } catch (error) {
                console.error("Failed to fetch poll details:", error);
                toast.error("Could not load poll details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();
    }, [id, getPoll]);

    const handleVote = async (side: number) => {
        if (!id || !stakeAmount || parseFloat(stakeAmount) <= 0) {
            toast.error("Please enter a valid amount to stake.");
            return;
        }
        const pollId = parseInt(id, 10);
        await predict(pollId, side, stakeAmount);
        const fetchedPoll = await getPoll(pollId);
        setPoll(fetchedPoll);
    };
    
    // Helper for displaying status
    const getStatusInfo = (status: PollStatus) => {
        switch (status) {
            case PollStatus.Open:
                return <span className="font-semibold text-green-400">Open</span>;
            case PollStatus.Pending:
                return <span className="font-semibold text-yellow-400">Pending Resolution</span>;
            case PollStatus.Resolved:
                return <span className="font-semibold text-red-400">Resolved</span>;
            default:
                return <span className="font-semibold text-gray-400">Unknown</span>;
        }
    };

    const isVotingDisabled = poll?.status !== PollStatus.Open || pollsLoading;

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner text-success"></span></div>;
    }

    if (!poll) {
        return <div className="text-center text-xl mt-10">Prediction not found.</div>;
    }

    const totalStaked = poll.yesStaked && poll.noStaked ? 
        ethers.formatEther(BigInt(poll.yesStaked.toString()) + BigInt(poll.noStaked.toString())) : '0';

    return (
        <div className="container mx-auto p-8 bg-gray-800 rounded-xl shadow-lg text-white max-w-4xl">
            <h1 className="text-4xl font-bold mb-4 break-words">{poll.question}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-lg">
                <p><strong>Status:</strong> {getStatusInfo(poll.status)}</p>
                <p><strong>Total Staked:</strong> {totalStaked} ETH</p>
                <p><strong>Voting Deadline:</strong> {poll.deadline.toLocaleString()}</p>
                <p><strong>Resolution Time:</strong> {poll.resolveTime.toLocaleString()}</p>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-8 dark:bg-gray-700 my-4 flex">
                <div className="bg-green-500 h-8 rounded-l-full flex items-center justify-center text-black font-bold" style={{ width: `${poll.totalStaked > 0 ? (Number(poll.yesStaked) / Number(poll.totalStaked)) * 100 : 50}%` }}>YES</div>
                <div className="bg-red-500 h-8 rounded-r-full flex items-center justify-center text-black font-bold" style={{ width: `${poll.totalStaked > 0 ? (Number(poll.noStaked) / Number(poll.totalStaked)) * 100 : 50}%` }}>NO</div>
            </div>

            {poll.status !== PollStatus.Open ? (
                 <div className="text-center text-yellow-400 font-bold text-xl p-4 bg-gray-700 rounded-lg">
                    {poll.status === PollStatus.Pending ? 'The voting deadline has passed. This poll is pending resolution.' : 'This poll has been resolved.'}
                 </div>
            ) : (
                <div className="mt-8 p-6 bg-gray-900 rounded-lg shadow-inner">
                    <h2 className="text-2xl font-bold mb-4 text-center">Cast Your Prediction</h2>
                    <div className="flex flex-col items-center gap-4">
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            placeholder="Amount to stake in ETH"
                            className="input input-bordered w-full max-w-xs bg-gray-700 focus:ring-2 focus:ring-purple-500"
                            disabled={isVotingDisabled}
                        />
                        <div className="flex gap-4">
                            <button onClick={() => handleVote(1)} className="btn btn-success btn-lg shadow-lg hover:shadow-green-500/50" disabled={isVotingDisabled || !stakeAmount}>
                                {pollsLoading ? <span className="loading loading-spinner"></span> : 'Vote YES'}
                            </button>
                            <button onClick={() => handleVote(0)} className="btn btn-error btn-lg shadow-lg hover:shadow-red-500/50" disabled={isVotingDisabled || !stakeAmount}>
                                {pollsLoading ? <span className="loading loading-spinner"></span> : 'Vote NO'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PollDetailPage;
