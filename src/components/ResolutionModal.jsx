import { useState } from 'react';
import useContract from '../hooks/useContract';

const ResolutionModal = ({ isOpen, onClose, pollId }) => {
  const [outcome, setOutcome] = useState(null);
  const { resolvePoll } = useContract();

  const handleResolve = async () => {
    if (outcome === null) {
      alert('Please select an outcome.');
      return;
    }
    try {
      await resolvePoll(pollId, outcome);
      alert('Poll resolved successfully!');
      onClose();
    } catch (error) {
      alert(`Failed to resolve poll: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Resolve Poll</h2>
        <p>Select the outcome for Poll ID: {pollId}</p>
        <div className="flex justify-around my-4">
          <button 
            onClick={() => setOutcome(1)} 
            className={`font-bold py-2 px-4 rounded ${outcome === 1 ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}>
            Yes
          </button>
          <button 
            onClick={() => setOutcome(0)} 
            className={`font-bold py-2 px-4 rounded ${outcome === 0 ? 'bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}>
            No
          </button>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
          <button onClick={handleResolve} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Resolve</button>
        </div>
      </div>
    </div>
  );
};

export default ResolutionModal;
