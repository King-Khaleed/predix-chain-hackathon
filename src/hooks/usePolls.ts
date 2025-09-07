import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Poll, PollStatus } from '../types/poll';
import useWallet from './useWallet';
import useContract from './useContract';
import * as web3 from '../utils/web3';

// Helper to parse contract data into a Poll object
const parsePoll = (id: number, data: any): Poll => {
    const deadlineSeconds = Number(data.deadline);
    const deadline = new Date(deadlineSeconds * 1000);
    const resolveTimeSeconds = Number(data.resolveTime);
    const resolveTime = new Date(resolveTimeSeconds * 1000);
    // Convert BigInt status from contract to a number for TS enum compatibility
    let status: PollStatus = Number(data.status);
    const now = Date.now() / 1000;

    // This is a client-side status adjustment.
    if (status === PollStatus.Open) {
        if (now > resolveTimeSeconds) {
            status = PollStatus.ReadyToResolve;
        } else if (now > deadlineSeconds) {
            status = PollStatus.Pending;
        }
    }

    return {
        id: id,
        creator: data.creator,
        question: data.question,
        deadline: deadline,
        resolveTime: resolveTime,
        outcome: Number(data.outcome), // Also ensure outcome is a number
        status: status,
        totalStaked: data.totalStaked.toString(),
        yesStaked: data.yesStaked.toString(),
        noStaked: data.noStaked.toString(),
    };
};

const usePolls = () => {
    const contract = useContract();
    const { address } = useWallet();
    const [loading, setLoading] = useState(false);

    const handleInteraction = async (interaction: () => Promise<void>, loadingMessage: string, successMessage: string) => {
        if (!contract) {
            toast.error("Please connect your wallet first.");
            return;
        }
        setLoading(true);
        const toastId = toast.loading(loadingMessage);
        try {
            await interaction();
            toast.success(successMessage, { id: toastId });
        } catch (error: any) {
            console.error("Transaction failed:", error);
            const errorMessage = error.reason || error.message || "An unknown error occurred.";
            toast.error(`Error: ${errorMessage}`, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const createPoll = (question: string, deadline: Date, resolveTime: Date) => {
        return handleInteraction(
            () => web3.createPoll(contract!, question, deadline, resolveTime),
            'Creating your poll...',
            'Poll created successfully!'
        );
    };

    const predict = (pollId: number, side: number, amount: string) => {
        return handleInteraction(
            () => web3.predict(contract!, pollId, side, amount),
            'Casting your prediction...',
            'Prediction cast successfully!'
        );
    };

    const resolvePoll = (pollId: number, outcome: number) => {
        return handleInteraction(
            () => web3.resolvePoll(contract!, pollId, outcome),
            'Resolving the poll...',
            'Poll resolved successfully!'
        );
    };

    const claim = (pollId: number) => {
        return handleInteraction(
            () => web3.claim(contract!, pollId),
            'Claiming your rewards...',
            'Rewards claimed successfully!'
        );
    };

    const getPolls = useCallback(async (includeResolved = true): Promise<Poll[]> => {
        if (!contract) return [];
        setLoading(true);
        try {
            const countBigInt = await contract.nextPollId();
            const count = Number(countBigInt);
            const polls: Poll[] = [];

            for (let i = count - 1; i >= 0; i--) {
                const data = await contract.getPoll(i);
                const poll = parsePoll(i, data);
                if (includeResolved || poll.status !== PollStatus.Resolved) {
                    polls.push(poll);
                }
            }
            return polls;
        } catch (error) {
            console.error("Could not fetch polls:", error);
            toast.error("Could not fetch poll data. Check console for details.");
            return [];
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const getPoll = useCallback(async (pollId: number): Promise<Poll | null> => {
        if (!contract) return null;
        setLoading(true);
        try {
            const data = await contract.getPoll(pollId);
            if (data.creator === '0x0000000000000000000000000000000000000000') {
                toast.error(`Poll with ID ${pollId} does not exist.`);
                return null;
            }
            return parsePoll(pollId, data);
        } catch (error) {
            console.error(`Could not fetch poll ${pollId}:`, error);
            toast.error(`Could not fetch details for poll ${pollId}.`);
            return null;
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const getUserStake = useCallback(async (pollId: number) => {
        if (!contract || !address) return { yesStake: '0', noStake: '0' };
        try {
            const { yesStake, noStake } = await web3.getUserStake(contract, pollId, address);
            return { yesStake: yesStake.toString(), noStake: noStake.toString() };
        } catch (error) {
            console.error("Could not fetch user stake:", error);
            return { yesStake: '0', noStake: '0' };
        }
    }, [contract, address]);

    return { loading, createPoll, predict, resolvePoll, claim, getPolls, getPoll, getUserStake };
};

export default usePolls;
