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
export const createPoll = async (signer, question, deadline) => {
    try {
        const contract = getContract(signer);
        const tx = await contract.createPoll(question, deadline);
        return await tx.wait();
    } catch (error) {
        console.error('Error creating poll:', error);
        // More specific error handling can be added here based on contract reverts
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
export const resolvePoll = async (signer, pollId) => {
    try {
        const contract = getContract(signer);
        const tx = await contract.resolvePoll(pollId);
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
            deadline: Number(poll.deadline),
            resolveTime: Number(poll.resolveTime),
            totalStaked: ethers.formatEther(poll.totalStaked),
            yesStaked: ethers.formatEther(poll.yesStaked),
            noStaked: ethers.formatEther(poll.noStaked),
            status: poll.status,
            creator: poll.creator,
        };
    } catch (error) {
        console.error(`Error fetching poll ${pollId}:`, error);
        // Return null to allow Promise.all to continue on single failures
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
        // Filter out any polls that failed to fetch
        return polls.filter(p => p !== null);
    } catch (error) {
        console.error('Error fetching all polls:', error);
        throw new Error('Failed to fetch all polls.');
    }
};
