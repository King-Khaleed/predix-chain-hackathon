import { useMemo } from 'react';
import { ethers } from 'ethers';
import useWallet from './useWallet';
import { PREDICTION_POLL_ABI, PREDICTION_POLL_CONTRACT_ADDRESS } from '../utils/constants';

const useContract = () => {
    const { signer } = useWallet(); // Use the signer from the wallet context

    return useMemo(() => {
        // If the signer is not available (e.g., wallet not connected), return null.
        // The contract will be connected with the signer, allowing for transactions.
        if (!signer) return null;
        return new ethers.Contract(PREDICTION_POLL_CONTRACT_ADDRESS, PREDICTION_POLL_ABI, signer);
    }, [signer]); // Dependency array is now on the signer
};

export default useContract;
