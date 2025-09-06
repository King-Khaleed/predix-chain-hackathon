import { useState, useEffect } from 'react';
import usePolls from '../hooks/usePolls';
import { Poll } from '../types/poll';
import PollCard from '../components/PollCard';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const Polls = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const { getPolls, loading } = usePolls();

    useEffect(() => {
        const fetchPolls = async () => {
            const fetchedPolls = await getPolls();
            setPolls(fetchedPolls);
        };

        fetchPolls();
    }, [getPolls]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <GlobeAltIcon className="mx-auto h-12 w-12 text-indigo-400" />
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl" style={{ fontFamily: `'Orbitron', sans-serif` }}>
                    All Prediction Polls
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                    Browse active and resolved prediction markets from across the community.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-white">
                    <p>Loading polls from the blockchain...</p>
                </div>
            ) : polls.length === 0 ? (
                <div className="text-center text-gray-400">
                    <p>No polls have been created yet. Be the first!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {polls.map((poll) => (
                        <PollCard key={poll.id} poll={poll} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Polls;
