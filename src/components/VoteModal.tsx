import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import useWallet from '../hooks/useWallet';
import { predict } from '../utils/web3';
import { Poll } from './PollCard';

interface VoteModalProps {
  poll: Poll;
  isOpen: boolean;
  onClose: () => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ poll, isOpen, onClose }) => {
  const { signer, isConnected } = useWallet();
  const [side, setSide] = useState<number | null>(null); // 0 for No, 1 for Yes
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!isConnected || !signer) {
      toast.error('Please connect your wallet to vote.');
      return;
    }
    if (side === null || !amount) {
      toast.error('Please select a side and enter an amount.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Submitting your prediction...');

    try {
      await predict(signer, poll.id, side, amount);
      toast.success('Prediction successful!', { id: toastId });
      onClose(); // Close modal on success
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Prediction failed.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm text-white">
        <h2 className="text-2xl font-bold mb-4">Vote on "{poll.question}"</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Prediction</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setSide(1)} 
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${side === 1 ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                  Yes
              </button>
              <button 
                onClick={() => setSide(0)} 
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${side === 0 ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                  No
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount (ETH)</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder='0.1'
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="py-2 px-4 rounded-md text-gray-300 hover:bg-gray-700">Cancel</button>
            <button 
              onClick={handlePredict}
              disabled={isLoading || !isConnected}
              className="py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-50 flex items-center">
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Submitting...' : 'Submit Vote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteModal;
