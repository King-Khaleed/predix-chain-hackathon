import { useMemo } from 'react';
import { ethers } from 'ethers';
import useWallet from './useWallet';
import PredictionPollABI from '../utils/PredictionPollABI.json';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

if (!contractAddress) {
    console.error("Contract address not found. Please set REACT_APP_CONTRACT_ADDRESS in your .env file.");
}

const useContract = () => {
    const { signer } = useWallet();

    const contract = useMemo(() => {
        if (!signer || !contractAddress) {
            return null;
        }

        return new ethers.Contract(contractAddress, PredictionPollABI, signer);
    }, [signer]);

    return contract;
};

export default useContract;
