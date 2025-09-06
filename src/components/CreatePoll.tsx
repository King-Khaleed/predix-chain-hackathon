import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import useWallet from '../hooks/useWallet';
import { createPoll } from '../utils/web3';

const CreatePoll = () => {
  const { signer, isConnected } = useWallet();
  const [question, setQuestion] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!isConnected || !signer) {
      toast.error('Please connect your wallet to create a poll.');
      return;
    }
    if (!question.trim() || !deadline) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Submitting poll to the blockchain...');

    try {
      // Convert deadline from YYYY-MM-DDTHH:mm to Unix timestamp
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
      
      const receipt = await createPoll(signer, question, deadlineTimestamp);
      
      toast.success('Poll created successfully!', { id: toastId });
      console.log('Transaction receipt:', receipt);
      // Reset form
      setQuestion('');
      setDeadline('');

    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An unknown error occurred.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto my-8">
      <h2 className="text-2xl font-bold text-white mb-4">Create a New Poll</h2>
      <form onSubmit={handleCreatePoll} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-300">Question</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder='e.g., Will ETH reach $5,000 by tomorrow?'
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-300">Prediction Deadline</label>
          <input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={!isConnected || isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Create Poll'}
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
