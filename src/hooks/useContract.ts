import { useMemo } from 'react';
import { ethers } from 'ethers';
import useWallet from './useWallet';
import PredictionPollABI from '../utils/PredictionPollABI.json';

// The correct, deployed BlockDAGs contract address
const contractAddress = '0x2819609394946F7B0588b23c2F2C5900c9B62A1a';

const useContract = () => {
    const { signer } = useWallet();

    // The contract instance is memoized to prevent re-creation on every render
    const contract = useMemo(() => {
        // The contract cannot be created without a signer. The signer is only available
        // after the user has connected their wallet.
        if (!signer) {
            return null;
        }

        return new ethers.Contract(contractAddress, PredictionPollABI, signer);
    }, [signer]);

    return contract;
};

export default useContract;
