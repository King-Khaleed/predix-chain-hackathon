import { ethers } from 'ethers';
import PredictionPollABI from './PredictionPollABI.json';

const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;
const rpcUrl = import.meta.env.VITE_APP_RPC_URL;

export const initProvider = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      return provider;
    } catch (error) {
      console.error('Error connecting to MetaMask', error);
      throw new Error('User denied account access.');
    }
  } else if (rpcUrl) {
    return new ethers.JsonRpcProvider(rpcUrl);
  } else {
    throw new Error('MetaMask not detected and no RPC URL configured. Please install MetaMask or set VITE_APP_RPC_URL.');
  }
};

export const getContract = (provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, PredictionPollABI, signer);
};

export const createPoll = async (provider, question, deadline, resolveTime) => {
  try {
    const contract = getContract(provider);
    const tx = await contract.createPoll(question, deadline, resolveTime);
    return await tx.wait();
  } catch (error) {
    console.error('Error creating poll', error);
    throw new Error('Failed to create poll.');
  }
};

export const makePrediction = async (provider, pollId, side, amountEther) => {
  try {
    const contract = getContract(provider);
    const amountWei = ethers.parseEther(amountEther);
    const tx = await contract.predict(pollId, side, { value: amountWei });
    return await tx.wait();
  } catch (error) {
    console.error('Error making prediction', error);
    throw new Error('Failed to make prediction.');
  }
};

export const resolvePoll = async (provider, pollId, outcome) => {
  try {
    const contract = getContract(provider);
    const tx = await contract.resolvePoll(pollId, outcome);
    return await tx.wait();
  } catch (error) {
    console.error('Error resolving poll', error);
    throw new Error('Failed to resolve poll.');
  }
};

export const claimReward = async (provider, pollId) => {
  try {
    const contract = getContract(provider);
    const tx = await contract.claim(pollId);
    return await tx.wait();
  } catch (error) {
    console.error('Error claiming reward', error);
    throw new Error('Failed to claim reward.');
  }
};

export const getPoll = async (provider, pollId) => {
  try {
    const contract = getContract(provider);
    const poll = await contract.getPoll(pollId);
    return {
      question: poll.question,
      deadline: Number(poll.deadline),
      resolveTime: Number(poll.resolveTime),
      totalStaked: Number(ethers.formatEther(poll.totalStaked)),
      yesStaked: Number(ethers.formatEther(poll.yesStaked)),
      noStaked: Number(ethers.formatEther(poll.noStaked)),
      status: poll.status,
      creator: poll.creator,
    };
  } catch (error) {
    console.error(`Error fetching poll ${pollId}` , error);
    throw new Error(`Failed to fetch poll ${pollId}.`);
  }
};

export const getAllPolls = async (provider) => {
  try {
    const contract = getContract(provider);
    const nextPollId = await contract.nextPollId();
    const polls = [];
    for (let i = 0; i < nextPollId; i++) {
      const poll = await getPoll(provider, i);
      polls.push({ ...poll, id: i });
    }
    return polls;
  } catch (error) {
    console.error('Error fetching all polls', error);
    throw new Error('Failed to fetch all polls.');
  }
};

export const getUserPredictions = async (provider) => {
  // This is a placeholder implementation. A more robust implementation would
  // involve indexing Predicted events on a backend or using a subgraph.
  try {
    const polls = await getAllPolls(provider);
    // This is a simplified check. A real implementation would need to check the contract's internal state.
    // This requires the contract to expose a mapping of user stakes.
    return polls.filter(poll => poll.totalStaked > 0); 
  } catch (error) {
    console.error('Error fetching user predictions', error);
    throw new Error('Failed to fetch user predictions.');
  }
};
