import { ethers, BrowserProvider, Eip1193Provider, Contract, BigNumber } from 'ethers';
import { Poll, PollSide } from '../types/poll';
import PredictionPollABI from './PredictionPollABI.json';

const contractAddress = '0x2819609394946F7B0588b23c2F2C5900c9B62A1a';

// --- Helper Functions (Private) ---

async function getProvider() {
    if (!window.ethereum) {
        throw new Error("No wallet found. Please install a Web3 wallet (e.g., MetaMask).");
    }
    return new BrowserProvider(window.ethereum as Eip1193Provider);
}

// This is now the centralized function to get a read-only or signing contract
export async function getContract(signer?: boolean) {
    const provider = await getProvider();
    if (signer) {
        const signerInstance = await provider.getSigner();
        return new Contract(contractAddress, PredictionPollABI, signerInstance);
    }
    return new Contract(contractAddress, PredictionPollABI, provider);
}

// --- Web3 Functions (Exported) ---

// Note: All functions now accept a contract instance.

export const createPoll = async (contract: Contract, question: string, deadline: Date, resolveTime: Date) => {
    const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);
    const resolveTimestamp = Math.floor(resolveTime.getTime() / 1000);
    const tx = await contract.createPoll(question, deadlineTimestamp, resolveTimestamp);
    await tx.wait();
};

export const getPolls = async (): Promise<Poll[]> => {
    const contract = await getContract(); // Read-only contract
    try {
        const rawPolls = await contract.getPolls();
        console.log("Raw polls from contract: ", rawPolls);

        return rawPolls.map((poll: any, index: number) => ({
            id: index,
            creator: poll.creator,
            question: poll.question,
            deadline: new Date(Number(poll.deadline) * 1000),
            resolveTime: new Date(Number(poll.resolveTime) * 1000),
            outcome: poll.outcome,
            status: poll.status,
            totalStaked: ethers.formatEther(poll.totalStaked),
            yesStaked: ethers.formatEther(poll.yesStaked),
            noStaked: ethers.formatEther(poll.noStaked),
        })).sort((a: Poll, b: Poll) => b.id - a.id);

    } catch (error) {
        console.error("Error in getPolls:", error);
        throw new Error("Could not fetch polls from the blockchain.");
    }
};

export const predict = async (contract: Contract, pollId: number, side: PollSide, amount: string) => {
    const value = ethers.parseEther(amount);
    const tx = await contract.predict(pollId, side, { value });
    await tx.wait();
};

export const resolvePoll = async (contract: Contract, pollId: number, outcome: PollSide) => {
    const tx = await contract.resolve(pollId, outcome);
    await tx.wait();
};

export const claim = async (contract: Contract, pollId: number) => {
    const tx = await contract.claim(pollId);
    await tx.wait();
};

export const getUserStake = async (contract: Contract, pollId: number, userAddress: string) => {
    const { yesStake, noStake } = await contract.getUserStake(pollId, userAddress);
    return {
        yesStake: ethers.formatEther(yesStake),
        noStake: ethers.formatEther(noStake),
    };
};
