import { BigNumber } from 'ethers';

// Enums matching the smart contract
export enum PollStatus {
    OPEN,
    RESOLVED,
    CANCELLED
}

export enum PollSide {
    NO,
    YES
}

// This interface matches the structure of the getPoll view function in the smart contract
export interface Poll {
    id: number;
    creator: string; // Address of the poll creator
    question: string;
    deadline: number; // Storing as Unix timestamp
    resolveTime: number; // Storing as Unix timestamp
    outcome: PollSide;
    status: PollStatus;
    totalStaked: BigNumber;
    yesStaked: BigNumber;
    noStaked: BigNumber;
}
