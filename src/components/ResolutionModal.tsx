import React, { useState } from 'react';
import { resolvePoll } from '../utils/web3';
import useWallet from '../hooks/useWallet';

interface ResolutionModalProps {
    pollId: number;
    isOpen: boolean;
    onClose: () => void;
}

const ResolutionModal: React.FC<ResolutionModalProps> = ({ pollId, isOpen, onClose }) => {
    const { signer } = useWallet();
    const [outcome, setOutcome] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleResolve = async () => {
        if (signer && outcome !== null) {
            setIsLoading(true);
            try {
                const tx = await resolvePoll(signer, pollId);
                console.log('Poll resolved:', tx);
                onClose();
            } catch (error) {
                console.error('Failed to resolve poll:', error);
            }
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Resolve Prediction</h2>
                <p className="mb-4">Select the winning outcome for this prediction.</p>
                <div className="flex justify-around mb-6">
                    <button 
                        onClick={() => setOutcome(true)} 
                        className={`px-6 py-2 rounded-lg ${outcome === true ? 'bg-green-500' : 'bg-gray-700'}`}>
                        Yes
                    </button>
                    <button 
                        onClick={() => setOutcome(false)} 
                        className={`px-6 py-2 rounded-lg ${outcome === false ? 'bg-red-500' : 'bg-gray-700'}`}>
                        No
                    </button>
                </div>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600">Cancel</button>
                    <button 
                        onClick={handleResolve} 
                        disabled={isLoading || outcome === null}
                        className="px-4 py-2 rounded-lg bg-indigo-600 disabled:bg-gray-500">
                        {isLoading ? 'Resolving...' : 'Resolve'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResolutionModal;
