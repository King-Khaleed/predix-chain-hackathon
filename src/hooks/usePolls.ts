import { useCallback, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import useContract from './useContract';
import { Poll, PollStatus, PollSide } from '../types/poll';

const usePolls = () => {
    const contract = useContract();
    const [loading, setLoading] = useState(false);

    const getPolls = useCallback(async (): Promise<Poll[]> => {
        if (!contract) return [];
        setLoading(true);
        try {
            const pollsCount = await contract.nextPollId();
            const polls: Poll[] = [];

            for (let i = 0; i < pollsCount; i++) {
                const p = await contract.getPoll(i);
                // The contract returns a tuple, so we map it to our Poll object
                polls.push({
                    id: i,
                    creator: p.creator,
                    question: p.question,
                    deadline: p.deadline.toNumber(),
                    resolveTime: p.resolveTime.toNumber(),
                    outcome: p.outcome,
                    status: p.status,
                    totalStaked: p.totalStaked,
                    yesStaked: p.yesStaked,
                    noStaked: p.noStaked,
                });
            }
            return polls.sort((a, b) => b.id - a.id); // Show newest first
        } catch (error) {
            console.error("Error fetching polls:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const createPoll = useCallback(async (question: string, deadline: number, resolveTime: number) => {
        if (!contract) return;
        setLoading(true);
        try {
            const tx = await contract.createPoll(question, deadline, resolveTime);
            await tx.wait();
        } catch (error) {
            console.error("Error creating poll:", error);
            throw error; // Re-throw to be caught in the component
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const predict = useCallback(async (pollId: number, side: PollSide, amount: string) => {
        if (!contract) return;
        setLoading(true);
        try {
            const stakeAmount = ethers.utils.parseEther(amount);
            const tx = await contract.predict(pollId, side, { value: stakeAmount });
            await tx.wait();
        } catch (error) {
            console.error("Error making prediction:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const resolvePoll = useCallback(async (pollId: number, outcome: PollSide) => {
        if (!contract) return;
        setLoading(true);
        try {
            const tx = await contract.resolvePoll(pollId, outcome);
            await tx.wait();
        } catch (error) {
            console.error("Error resolving poll:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const claim = useCallback(async (pollId: number) => {
        if (!contract) return;
        setLoading(true);
        try {
            const tx = await contract.claim(pollId);
            await tx.wait();
        } catch (error) {
            console.error("Error claiming winnings:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [contract]);

    const getUserStake = useCallback(async (pollId: number, userAddress: string): Promise<{yesStake: BigNumber, noStake: BigNumber}> => {
        if (!contract) return { yesStake: BigNumber.from(0), noStake: BigNumber.from(0) };
        try {
            const stakes = await contract.getUserStake(pollId, userAddress);
            return {
                yesStake: stakes.yesStake,
                noStake: stakes.noStake
            };
        } catch (error) {
            console.error("Error fetching user stake:", error);
            return { yesStake: BigNumber.from(0), noStake: BigNumber.from(0) };
        }
    }, [contract]);

    return { loading, getPolls, createPoll, predict, resolvePoll, claim, getUserStake };
};

export default usePolls;
