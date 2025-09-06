import { ethers } from 'ethers';
import PredictionPollABI from './PredictionPollABI.json';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const rpcUrl = process.env.REACT_APP_RPC_URL;

// This function is for read-only operations when the user has not connected their wallet.
export const getReadOnlyProvider = () => {
    if (!rpcUrl) {
        throw new Error("RPC URL not configured. Please set REACT_APP_RPC_URL in your .env file.");
    }
    return new ethers.JsonRpcProvider(rpcUrl);
};

export const getContract = (providerOrSigner) => {
    if (!contractAddress) {
        throw new Error("Contract address not found. Please set REACT_APP_CONTRACT_ADDRESS in your .env file.");
    }
    return new ethers.Contract(contractAddress, PredictionPollABI, providerOrSigner);
};

// Takes a signer to execute a transaction
export const createPoll = async (signer, question, deadline, resolveTime) => {
    try {
        const contract = getContract(signer);
        const tx = await contract.createPoll(question, deadline, resolveTime);
        return await tx.wait();
    } catch (error) {
        console.error('Error creating poll:', error);
        throw new Error('Failed to create poll. Please check console for details.');
    }
};

// Takes a signer to execute a transaction
export const predict = async (signer, pollId, side, amountEth) => {
    try {
        const contract = getContract(signer);
        const amountWei = ethers.parseEther(amountEth);
        const tx = await contract.predict(pollId, side, { value: amountWei });
        return await tx.wait();
    } catch (error) {
        console.error('Error making prediction:', error);
        throw new Error('Failed to make prediction. Please check console for details.');
    }
};

// Takes a signer to execute a transaction
export const resolvePoll = async (signer, pollId, outcome) => {
    try {
        const contract = getContract(signer);
        const tx = await contract.resolvePoll(pollId, outcome);
        return await tx.wait();
    } catch (error) {
        console.error('Error resolving poll:', error);
        throw new Error('Failed to resolve poll. Please check console for details.');
    }
};

// Takes a signer to execute a transaction
export const claim = async (signer, pollId) => {
    try {
        const contract = getContract(signer);
        const tx = await contract.claim(pollId);
        return await tx.wait();
    } catch (error) {
        console.error('Error claiming reward:', error);
        throw new Error('Failed to claim reward. Please check console for details.');
    }
};

// Uses a provider for read-only access
export const getPoll = async (provider, pollId) => {
    try {
        const contract = getContract(provider);
        const poll = await contract.getPoll(pollId);
        return {
            id: pollId,
            question: poll.question,
            creator: poll.creator,
            deadline: Number(poll.deadline),
            resolveTime: Number(poll.resolveTime),
            totalStaked: poll.totalStaked,
            yesStaked: poll.yesStaked,
            noStaked: poll.noStaked,
            status: poll.status,
        };
    } catch (error) {
        console.error(`Error fetching poll ${pollId}:`, error);
        return null;
    }
};

// Uses a provider for read-only access
export const getAllPolls = async (provider) => {
    const contract = getContract(provider);
    try {
        const nextPollId = await contract.nextPollId();
        const pollPromises = [];
        for (let i = 0; i < nextPollId; i++) {
            pollPromises.push(getPoll(provider, i));
        }
        const polls = await Promise.all(pollPromises);
        return polls.filter(p => p !== null);
    } catch (error) {
        console.error('Error fetching all polls:', error);
        throw new Error('Failed to fetch all polls.');
    }
};

// New function to check a user's prediction for a specific poll
export const getUserPrediction = async (provider, pollId, userAddress) => {
    if (!userAddress) return null;
    try {
        const contract = getContract(provider);
        const prediction = await contract.predictions(pollId, userAddress);
        // If amount is 0, they haven't voted.
        if (prediction.amount === 0n) return null;
        return {
            side: prediction.side, // true for Yes, false for No
            amount: prediction.amount
        };
    } catch (error) {
        console.error(`Error fetching user prediction for poll ${pollId}:`, error);
        return null;
    }
};

// New function to check if a user has already claimed their winnings
export const getHasClaimed = async (provider, pollId, userAddress) => {
    if (!userAddress) return false;
    try {
        const contract = getContract(provider);
        return await contract.hasClaimed(pollId, userAddress);
    } catch (error) {
        console.error(`Error checking claim status for poll ${pollId}:`, error);
        return false; // Assume not claimed if error occurs
    }
};