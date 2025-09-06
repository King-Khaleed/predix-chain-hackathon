import { useState, useEffect, useMemo } from 'react';
import usePolls from '../hooks/usePolls';
import useWallet from '../hooks/useWallet';
import { Poll } from '../types/poll';
import PollCard from '../components/PollCard';
import { UserCircleIcon, BeakerIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
    const [allPolls, setAllPolls] = useState<Poll[]>([]);
    const { getPolls, getUserStake, loading: pollsLoading } = usePolls();
    const { address, isConnected, loading: walletLoading } = useWallet(); // Correctly uses the hook now
    const [participatedPollIds, setParticipatedPollIds] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isConnected && address) {
            const fetchAllData = async () => {
                setIsLoading(true);
                try {
                    const fetchedPolls = await getPolls();
                    setAllPolls(fetchedPolls);

                    if (fetchedPolls.length > 0) {
                        const participationSet = new Set<number>();
                        await Promise.all(fetchedPolls.map(async (poll) => {
                            try {
                                const stakes = await getUserStake(poll.id, address);
                                // Corrected Ethers v6 logic: Compare parsed BigInts
                                if (stakes && (stakes.yesStake > 0 || stakes.noStake > 0)) {
                                    participationSet.add(poll.id);
                                }
                            } catch (error) {
                                console.error(`Failed to get user stake for poll ${poll.id}:`, error);
                            }
                        }));
                        setParticipatedPollIds(participationSet);
                    }
                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchAllData();
        } else if (!walletLoading) {
            setIsLoading(false);
        }
    }, [isConnected, address, walletLoading, getPolls, getUserStake]);

    const myCreatedPolls = useMemo(() => {
        if (!address) return [];
        return allPolls.filter(poll => poll.creator.toLowerCase() === address.toLowerCase());
    }, [allPolls, address]);

    const myPredictedPolls = useMemo(() => {
        return allPolls.filter(poll => participatedPollIds.has(poll.id));
    }, [allPolls, participatedPollIds]);

    if (isLoading || walletLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-white text-lg">Loading your dashboard...</p>
                <p className="text-gray-400">Please ensure your wallet is connected.</p>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <UserCircleIcon className="mx-auto h-12 w-12 text-indigo-400" />
                <h1 className="text-4xl font-bold text-white">Connect Your Wallet</h1>
                <p className="mt-4 text-lg text-gray-300">Please connect your wallet to view your personalized dashboard.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <UserCircleIcon className="mx-auto h-12 w-12 text-indigo-400" />
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl" style={{ fontFamily: `'Orbitron', sans-serif` }}>
                    Your Dashboard
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                    Track your created polls and your active predictions.
                </p>
            </div>

            <div className="space-y-16">
                <div>
                    <div className="flex items-center mb-6">
                         <BeakerIcon className="h-8 w-8 text-teal-400 mr-3" />
                         <h2 className="text-3xl font-bold text-white" style={{ fontFamily: `'Orbitron', sans-serif` }}>Polls You've Created</h2>
                    </div>
                    {myCreatedPolls.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myCreatedPolls.map((poll) => (
                                <PollCard key={`created-${poll.id}`} poll={poll} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-4">You haven't created any polls yet. Why not start one?</p>
                    )}
                </div>

                <div>
                     <div className="flex items-center mb-6">
                         <UserCircleIcon className="h-8 w-8 text-purple-400 mr-3" />
                         <h2 className="text-3xl font-bold text-white" style={{ fontFamily: `'Orbitron', sans-serif` }}>Polls You've Predicted On</h2>
                    </div>
                    {myPredictedPolls.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myPredictedPolls.map((poll) => (
                                <PollCard key={`predicted-${poll.id}`} poll={poll} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-4">You haven't made any predictions yet. Find a poll and take a position!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
