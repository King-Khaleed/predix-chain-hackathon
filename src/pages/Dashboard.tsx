import { useState, useEffect, useMemo } from 'react';
import usePolls from '../hooks/usePolls';
import useWallet from '../hooks/useWallet';
import { Poll } from '../types/poll';
import PollCard from '../components/PollCard';
import { UserCircleIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { BigNumber } from 'ethers';

const Dashboard = () => {
    const [allPolls, setAllPolls] = useState<Poll[]>([]);
    const { getPolls, getUserStake, loading } = usePolls();
    const { address } = useWallet();
    // Add a state to track which polls the user has participated in
    const [participatedPollIds, setParticipatedPollIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchAllData = async () => {
            const fetchedPolls = await getPolls();
            setAllPolls(fetchedPolls);

            if (address && fetchedPolls.length > 0) {
                const participationSet = new Set<number>();
                for (const poll of fetchedPolls) {
                    const stakes = await getUserStake(poll.id, address);
                    if (stakes.yesStake.gt(0) || stakes.noStake.gt(0)) {
                        participationSet.add(poll.id);
                    }
                }
                setParticipatedPollIds(participationSet);
            }
        };

        fetchAllData();
    }, [getPolls, getUserStake, address]);

    const myCreatedPolls = useMemo(() => {
        if (!address) return [];
        return allPolls.filter(poll => poll.creator.toLowerCase() === address.toLowerCase());
    }, [allPolls, address]);

    const myPredictedPolls = useMemo(() => {
        return allPolls.filter(poll => participatedPollIds.has(poll.id));
    }, [allPolls, participatedPollIds]);

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

            {loading && allPolls.length === 0 ? (
                <div className="text-center text-white"><p>Loading your data from the blockchain...</p></div>
            ) : (
                <div className="space-y-16">
                    {/* My Created Polls */}
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

                    {/* My Predictions */}
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
            )}
        </div>
    );
};

export default Dashboard;
