import { ethers, BrowserProvider, Eip1193Provider, Contract } from 'ethers';

async function getProvider() {
    if (!window.ethereum) {
        throw new Error("No wallet found. Please install a Web3 wallet (e.g., MetaMask).");
    }
    return new BrowserProvider(window.ethereum as Eip1193Provider);
}

export const createPoll = async (contract: Contract, question: string, deadline: Date, resolveTime: Date) => {
    const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);
    const resolveTimestamp = Math.floor(resolveTime.getTime() / 1000);
    const tx = await contract.createPoll(question, deadlineTimestamp, resolveTimestamp);
    await tx.wait();
};

export const predict = async (contract: Contract, pollId: number, side: number, amount: string) => {
    const value = ethers.parseEther(amount);
    const tx = await contract.predict(pollId, side, { value });
    await tx.wait();
};

export const resolvePoll = async (contract: Contract, pollId: number, outcome: number) => {
    console.log("Attempting to execute resolvePoll..."); // Diagnostic log
    const tx = await contract.resolvePoll(pollId, outcome);
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
