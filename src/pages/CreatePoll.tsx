import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePolls from '../hooks/usePolls';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const CreatePoll = () => {
    const [question, setQuestion] = useState('');
    const [deadline, setDeadline] = useState('');
    const [resolveTime, setResolveTime] = useState('');
    const { createPoll, loading } = usePolls();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
        const resolveTimestamp = Math.floor(new Date(resolveTime).getTime() / 1000);

        if (isNaN(deadlineTimestamp) || isNaN(resolveTimestamp)) {
            setError("Please enter valid dates for both deadline and resolution time.");
            return;
        }

        if (deadlineTimestamp <= Math.floor(Date.now() / 1000)) {
            setError("The prediction deadline must be in the future.");
            return;
        }

        if (resolveTimestamp <= deadlineTimestamp) {
            setError("The resolution time must be after the prediction deadline.");
            return;
        }

        try {
            await createPoll(question, deadlineTimestamp, resolveTimestamp);
            navigate('/polls'); // Redirect to polls page on success
        } catch (e: any) {
            setError(e.message || 'Failed to create poll.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
             <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <PlusCircleIcon className="mx-auto h-12 w-12 text-indigo-400" />
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl" style={{ fontFamily: `'Orbitron', sans-serif` }}>
                        Create a New Poll
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Propose a new prediction market for the community to participate in.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8 space-y-6">
                    <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">Question</label>
                        <input
                            type="text"
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder='e.g., "Will BTC close above $70k this Friday?"'
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-2">Prediction Deadline</label>
                        <input
                            type="datetime-local"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="resolveTime" className="block text-sm font-medium text-gray-300 mb-2">Resolution Time</label>
                        <input
                            type="datetime-local"
                            id="resolveTime"
                            value={resolveTime}
                            onChange={(e) => setResolveTime(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-105">
                            {loading ? 'Creating on the blockchain...' : 'Create Poll'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreatePoll;
