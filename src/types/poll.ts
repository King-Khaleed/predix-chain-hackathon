import { BigNumber } from 'ethers';

// Enum for Poll Status. NOTE: Pending and ReadyToResolve are client-side derived statuses.
export enum PollStatus {
  Open,      // From contract (0)
  Resolved,  // From contract (1)
  Pending,    // Derived on client-side
  ReadyToResolve // Derived on client-side
}

// Enum for Poll Side, matching the contract's enum
export enum PollSide {
  No, // Represents 0
  Yes  // Represents 1
}

export interface Poll {
  id: number;
  creator: string;
  question: string;
  deadline: Date; // Corresponds to uint256
  resolveTime: Date; // Corresponds to uint256
  outcome: PollSide; // Corresponds to enum PredictionPoll.Side
  status: PollStatus; // Corresponds to enum PredictionPoll.Status
  totalStaked: string; // Corresponds to uint256, formatted as a string
  yesStaked: string; // Corresponds to uint256, formatted as a string
  noStaked: string; // Corresponds to uint256, formatted as a string
}
