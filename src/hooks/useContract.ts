import { useMemo } from 'react';
import { ethers } from 'ethers';
import useWallet from './useWallet';
import PredictionPollABI from '../utils/PredictionPollABI.json';

// The new, correct, deployed contract address
const contractAddress = '0x05Af3914Db5F05E95b478cEC4434aA8334e34c3a';

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
