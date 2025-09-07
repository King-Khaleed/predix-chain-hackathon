import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Contract } from 'ethers';
import { Poll, PollSide } from '../types/poll';
import useContract from './useContract';
import * as web3 from '../utils/web3';

const usePolls = () => {
    const contract = useContract();
    const [loading, setLoading] = useState(false);

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
        const toastId = toast.loading(messages.loading);
        try {
            await interaction(contract, ...args);
            toast.success(messages.success, { id: toastId });
        } catch (error: any) {
            console.error(messages.error, error);
            const errorMessage = error.reason || error.message || "An unknown error occurred.";
            toast.error(errorMessage, { id: toastId });
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

    const predict = async (pollId: number, side: number, amount: string) => {
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

    const resolvePoll = async (pollId: number, outcome: number) => {
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

    const getPolls = useCallback(async (): Promise<Poll[]> => {
        if (!contract) return [];
        setLoading(true);
        try {
            const totalPolls = await contract.nextPollId();
            const polls: Poll[] = [];
            for (let i = 0; i < totalPolls; i++) {
                try {
                    const pollData = await contract.getPoll(i);
                    polls.push({ 
                        id: i,
                        creator: pollData.creator,
                        question: pollData.question,
                        deadline: new Date(Number(pollData.deadline) * 1000),
                        resolveTime: new Date(Number(pollData.resolveTime) * 1000),
                        status: pollData.status,
                        totalStaked: pollData.totalStaked.toString(),
                        yesStaked: pollData.yesStaked.toString(),
                        noStaked: pollData.noStaked.toString(),
                        outcome: pollData.outcome,
                    } as Poll);
                } catch (error) {
                    console.error(`Failed to fetch poll with id: ${i}`, error);
                }
            }
            return polls;
        } catch (error: any) {
            console.error("Failed to get polls:", error);
            toast.error(error.message || "Could not fetch polls from the blockchain.");
            return [];
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const getPoll = useCallback(async (id: number): Promise<Poll | null> => {
        if (!contract) return null;
        try {
            const pollData = await contract.getPoll(id);
            return {
                id: id,
                creator: pollData.creator,
                question: pollData.question,
                deadline: new Date(Number(pollData.deadline) * 1000),
                resolveTime: new Date(Number(pollData.resolveTime) * 1000),
                status: pollData.status,
                totalStaked: pollData.totalStaked.toString(),
                yesStaked: pollData.yesStaked.toString(),
                noStaked: pollData.noStaked.toString(),
                outcome: pollData.outcome,
            } as Poll;
        } catch (error) {
            console.error(`Failed to fetch poll with id: ${id}`, error);
            return null;
        }
    }, [contract]);
    
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


    return { getPoll, getPolls, createPoll, predict, resolvePoll, claim, getUserStake, loading };
};

export default usePolls;
