# Project Blueprint: PredictionPolls on BlockDAG

## 1. Executive Summary

*   **Project Name:** PredictionPolls
*   **Category:** Decentralized Application (dApp) / Web3
*   **Core Concept:** A blockchain-based prediction market platform where users can create, discover, and vote on prediction polls about real-world events.
*   **Value Proposition:** To provide a transparent, tamper-proof, and engaging platform for crowd-sourced forecasting, built on the BlockDAG ecosystem.

## 2. The Problem We're Solving

Traditional online polls and prediction markets suffer from a lack of trust, opaque mechanisms, high barriers to entry, and no immutable record of predictions.

## 3. Our Solution: The Blockchain Advantage

PredictionPolls leverages the BlockDAG blockchain to provide:

*   **Transparency & Trustlessness:** All data is public and verifiable.
*   **Censorship-Resistance:** No single entity can alter or remove polls.
*   **Permissionless Access:** Anyone with a Web3 wallet can participate globally.
*   **Immutable History:** A permanent public record of collective intelligence.

## 4. How It Works: The User's Perspective

1.  **Connect:** Users connect their Web3 wallet (MetaMask).
2.  **Browse:** Users explore active prediction polls.
3.  **Predict:** Users cast their vote (Yes/No) by signing a transaction.
4.  **Create:** Users can create new polls with a question and resolution time.
5.  **Resolve:** The creator submits the final outcome, recording it on-chain.
6.  **Verify:** Anyone can view poll results on-chain.

## 5. Technical Architecture & Stack

| Layer               | Technology                          | Purpose                                                 |
| ------------------- | ----------------------------------- | ------------------------------------------------------- |
| **Blockchain**      | **BlockDAG Network (Testnet)**      | The decentralized backbone for the smart contract.      |
| **Smart Contract**  | Solidity                            | The backend logic managing polls and predictions.       |
| **Frontend**        | React (TypeScript)                  | For building a dynamic, modern user interface.          |
| **Styling & UI**    | Tailwind CSS                        | For a responsive and beautiful utility-first design.    |
| **Web3 Interaction**| Ethers.js                           | To connect the frontend to the BlockDAG blockchain.     |
| **Development**     | Hardhat                             | For local development and contract testing.             |
| **Wallet**          | MetaMask                            | For user authentication and transaction signing.        |

---

## Current Status & Action Plan

You have successfully written and deployed the smart contract using the BlockDAGs IDE, and you have testnet BDAG tokens for gas fees. However, the frontend is not communicating with the contract, and you have some excellent questions about the workflow.

Here is the plan to fix this and answer your questions.

### **Answering Your Questions**

1.  **The Frontend Problem:** The reason your frontend doesn't work while the IDE does is simple: **The frontend doesn't know which network to talk to.** Your IDE is pointed directly at the BlockDAGs network, but our React app is currently configured for a generic network (Sepolia). We need to give it the correct address.

2.  **Do you need to redeploy the contract?** **No, you do not.** This is a key concept. The smart contract you deployed is a persistent program that lives on the BlockDAGs blockchain. It's a **factory** for polls. You deploy it **once**, and then your frontend will call the `createPoll` function on that *same contract* every time a new poll is made. The contract manages all the polls internally.

3.  **Deployment: IDE vs. Frontend?** You were correct to deploy using the BlockDAGs IDE. **Deployment is a one-time setup step.** The **frontend's job is for users to *interact* with the already-deployed contract.** Users will never deploy anything; they will only call functions like `predict` and `createPoll`.

### **Action Plan: Connecting the Frontend**

To get your frontend working, we need to do two things:

1.  **Update the Contract Address:** I need the address of the `PredictionPoll` contract that you deployed on the BlockDAGs testnet.
2.  **Update the Network Connection:** I need the **RPC URL** for the BlockDAGs testnet. This is the "phone number" that your frontend will use to call the blockchain.

I will start by reading the `web3.ts` file, where we define the connection, so I can show you exactly where we need to make these changes.
