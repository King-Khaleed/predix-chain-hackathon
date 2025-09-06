import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import usePolls from '../hooks/usePolls';
import { Poll } from '../types/poll';
import PollCard from '../components/PollCard';
import { CubeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

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
                <CubeIcon className="mx-auto h-12 w-12 text-indigo-400" />
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl" style={{ fontFamily: `'Orbitron', sans-serif` }}>
                    All Prediction Polls
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                    Browse active and resolved polls on the blockchain.
                </p>
                 <div className="mt-8">
                    <Link to="/create-poll">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center">
                            <PlusCircleIcon className="h-6 w-6 mr-2" />
                            Create New Poll
                        </button>
                    </Link>
                </div>
            </div>

            {loading && polls.length === 0 ? (
                <div className="text-center">
                    <p className="text-white text-lg">Loading polls from the blockchain...</p>
                </div>
            ) : polls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {polls.map((poll) => (
                        <PollCard key={poll.id} poll={poll} />
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-white text-lg">No polls found.</p>
                    <p className="text-gray-400">Be the first to create one!</p>
                </div>
            )}
        </div>
    );
};

export default Polls;
