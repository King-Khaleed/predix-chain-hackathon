import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Contract } from 'ethers';
import { Poll, PollSide } from '../types/poll';
import useContract from './useContract';
import * as web3 from '../utils/web3';

const usePolls = () => {
    const contract = useContract(); // The single source of truth for the contract
    const [loading, setLoading] = useState(false);

    // The generic handler now passes the contract to the web3 function
    const handleInteraction = useCallback(async (
        interaction: (contract: Contract, ...args: any[]) => Promise<any>,
        args: any[],
        messages: { loading: string; success: string; error: string; }
    ) => {
        if (!contract) {
            toast.error("Please connect your wallet first. The contract is not available.");
            return;
        }

        setLoading(true);
        try {
            const promise = interaction(contract, ...args);
            await toast.promise(promise, messages);
        } catch (error: any) {
            console.error(messages.error, error);
            toast.error(error.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const createPoll = async (question: string, deadline: Date, resolveTime: Date) => {
        await handleInteraction(
            web3.createPoll,
            [question, deadline, resolveTime],
            {
                loading: 'Submitting your new poll...',
                success: 'Poll created successfully!',
                error: 'Failed to create poll.',
            }
        );
    };

    const predict = async (pollId: number, side: PollSide, amount: string) => {
        await handleInteraction(
            web3.predict,
            [pollId, side, amount],
            {
                loading: 'Casting your prediction...',
                success: 'Prediction cast successfully!',
                error: 'Failed to cast prediction.',
            }
        );
    };

    const resolvePoll = async (pollId: number, outcome: PollSide) => {
        await handleInteraction(
            web3.resolvePoll,
            [pollId, outcome],
            {
                loading: 'Resolving poll...',
                success: 'Poll resolved successfully!',
                error: 'Failed to resolve poll.',
            }
        );
    };

    const claim = async (pollId: number) => {
        await handleInteraction(
            web3.claim,
            [pollId],
            {
                loading: 'Claiming your reward...',
                success: 'Reward claimed successfully!',
                error: 'Failed to claim reward.',
            }
        );
    };

    // Read-only functions do not need to go through handleInteraction
    const getPolls = useCallback(async (): Promise<Poll[]> => {
        setLoading(true);
        try {
            // getPolls does not require a signer, so it can be called directly.
            return await web3.getPolls();
        } catch (error: any) {
            console.error("Failed to get polls:", error);
            toast.error(error.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);
    
    const getUserStake = useCallback(async (pollId: number, userAddress: string) => {
        if (!contract) return { yesStake: "0", noStake: "0" }; // Return default if contract not ready
        setLoading(true);
        try {
            return await web3.getUserStake(contract, pollId, userAddress);
        } catch (error: any) {
            console.error(error.message);
            return { yesStake: "0", noStake: "0" };
        } finally {
            setLoading(false);
        }
    }, [contract]);


    return { getPolls, createPoll, predict, resolvePoll, claim, getUserStake, loading };
};

export default usePolls;
