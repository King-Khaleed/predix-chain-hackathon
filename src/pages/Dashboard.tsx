import { useState, useEffect, useMemo, useCallback } from 'react';
import usePolls from '../hooks/usePolls';
import useWallet from '../hooks/useWallet';
import { Poll, PollStatus, PollSide } from '../types/poll';
import PollCard from '../components/PollCard';
import Countdown from '../components/Countdown'; // Import the Countdown component
import { UserCircleIcon, BeakerIcon, ClockIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
    const [allPolls, setAllPolls] = useState<Poll[]>([]);
    const { getPolls, getUserStake, resolvePoll, loading: pollsLoading } = usePolls();
    const { address, isConnected } = useWallet();
    const [participatedPollIds, setParticipatedPollIds] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (isConnected && address) {
            setIsLoading(true);
            try {
                const fetchedPolls = await getPolls();
                setAllPolls(fetchedPolls);

                const participationSet = new Set<number>();
                for (const poll of fetchedPolls) {
                    const stakes = await getUserStake(poll.id);
                    if (parseFloat(stakes.yesStake) > 0 || parseFloat(stakes.noStake) > 0) {
                        participationSet.add(poll.id);
                    }
                }
                setParticipatedPollIds(participationSet);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [isConnected, address, getPolls, getUserStake]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30 seconds
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleResolve = async (pollId: number, outcome: PollSide) => {
        await resolvePoll(pollId, outcome);
        fetchData(); 
    };

    const createdPolls = useMemo(() => {
        return allPolls.filter(poll => poll.creator.toLowerCase() === address?.toLowerCase());
    }, [allPolls, address]);

    const participatedPolls = useMemo(() => {
        return allPolls.filter(poll => participatedPollIds.has(poll.id) && poll.creator.toLowerCase() !== address?.toLowerCase());
    }, [allPolls, participatedPollIds, address]);

    if (!isConnected || !address) {
        return <div className="text-center text-xl mt-10">Please connect your wallet to view your dashboard.</div>;
    }

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner text-success"></span></div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-gray-800 rounded-xl shadow-lg text-white p-6 mb-8 flex items-center">
                <UserCircleIcon className="h-12 w-12 text-purple-400 mr-4"/>
                <div>
                    <h1 className="text-2xl font-bold">My Dashboard</h1>
                    <p className="text-sm text-gray-400 break-all">{address}</p>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center"><BeakerIcon className="h-8 w-8 mr-3 text-cyan-400"/>My Created Polls</h2>
                {createdPolls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {createdPolls.map(poll => {
                            const isPendingResolution = poll.status === PollStatus.Pending;
                            const isReadyToResolve = poll.status === PollStatus.ReadyToResolve;
                            
                            return (
                                <div key={poll.id} className="bg-gray-800 rounded-lg shadow-lg flex flex-col justify-between">
                                    <PollCard poll={poll} />
                                    <div className="p-4 bg-gray-900 rounded-b-lg mt-auto">
                                        {isPendingResolution && (
                                            <div className='text-center'>
                                                <h4 className='font-bold mb-2 text-amber-400'>Pending Resolution</h4>
                                                <p className='text-sm text-gray-400 mb-2'>This prediction can be resolved after:</p>
                                                <p className='text-sm font-semibold text-gray-300 mb-2'>{poll.resolveTime.toLocaleString()}</p>
                                                <div className='flex items-center justify-center text-lg font-bold text-cyan-400'>
                                                    <ClockIcon className="h-5 w-5 mr-2"/>
                                                    <Countdown targetDate={poll.resolveTime} />
                                                </div>
                                            </div>
                                        )}
                                        {isReadyToResolve && (
                                            <div>
                                                <h4 className='text-center font-bold mb-2 text-green-400'>Ready to Resolve</h4>
                                                <div className="flex justify-around gap-2">
                                                    <button 
                                                        onClick={() => handleResolve(poll.id, PollSide.Yes)}
                                                        className="btn btn-sm btn-success flex-1"
                                                        disabled={pollsLoading}
                                                    >
                                                        Resolve YES
                                                    </button>
                                                    <button 
                                                        onClick={() => handleResolve(poll.id, PollSide.No)}
                                                        className="btn btn-sm btn-error flex-1"
                                                        disabled={pollsLoading}
                                                    >
                                                        Resolve NO
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-4">You haven't created any predictions yet.</p>
                )}
            </div>

            <div>
                <h2 className="text-3xl font-bold mb-6">My Participated Predictions</h2>
                {participatedPolls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {participatedPolls.map(poll => <PollCard key={poll.id} poll={poll} linkTo={`/poll/${poll.id}`} />)}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-4">You haven't participated in any other predictions yet.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
