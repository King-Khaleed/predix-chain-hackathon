import { useState } from 'react';
import {
  createPoll as createPollWeb3,
  makePrediction as makePredictionWeb3,
  resolvePoll as resolvePollWeb3,
  claimReward as claimRewardWeb3,
  getPoll as getPollWeb3,
  getAllPolls as getAllPollsWeb3,
  getUserPredictions as getUserPredictionsWeb3,
} from '../utils/web3';
import useWallet from './useWallet';

const useContract = () => {
  const { provider } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleContractCall = async (contractFn, ...args) => {
    if (!provider) {
      setError('Wallet not connected');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await contractFn(provider, ...args);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const createPoll = (question, deadline, resolveTime) =>
    handleContractCall(createPollWeb3, question, deadline, resolveTime);

  const makePrediction = (pollId, side, amountEther) =>
    handleContractCall(makePredictionWeb3, pollId, side, amountEther);

  const resolvePoll = (pollId, outcome) =>
    handleContractCall(resolvePollWeb3, pollId, outcome);

  const claimReward = (pollId) => handleContractCall(claimRewardWeb3, pollId);

  const getPoll = (pollId) => handleContractCall(getPollWeb3, pollId);

  const getAllPolls = () => handleContractCall(getAllPollsWeb3);

  const getUserPredictions = (userAddress) =>
    handleContractCall(getUserPredictionsWeb3, userAddress);

  return {
    loading,
    error,
    createPoll,
    makePrediction,
    resolvePoll,
    claimReward,
    getPoll,
    getAllPolls,
    getUserPredictions,
  };
};

export default useContract;
