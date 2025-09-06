# Project Blueprint: Decentralized Prediction Markets

## Overview

This document outlines the architecture and implementation of a decentralized prediction market application built with React, Ethers.js, and a Solidity smart contract. The application allows users to create polls, predict outcomes, and earn rewards based on the results.

## Core Features

*   **Wallet Integration:** Users can connect their MetaMask wallet to interact with the application.
*   **Poll Creation:** Users can create new prediction polls by specifying a question and a deadline.
*   **Prediction (Voting):** Users can predict the outcome of a poll by staking a certain amount of ETH on "Yes" or "No".
*   **Poll Resolution:** After the deadline, the poll creator can resolve the poll, determining the winning side.
*   **Reward Claiming:** Users who predicted the correct outcome can claim their share of the prize pool.
*   **Dashboard:** Users can view their past predictions and claimable rewards on their personal dashboard.

## Technical Architecture

### Frontend

*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Wallet Integration:** `ethers` v6
*   **Component Library:** None (custom components)
*   **Routing:** `react-router-dom`
*   **State Management:** `useState`, `useEffect`, and `useContext` (via custom hooks)
*   **Notifications:** `react-hot-toast`

### Smart Contract

*   **Language:** Solidity
*   **Contract:** `PredictionPoll.sol` (details not in scope of this document)
*   **ABI:** `PredictionPollABI.json`

## Project Structure

```
src
├── App.tsx
├── main.tsx
├── index.css
├── assets
│   └── react.svg
├── components
│   ├── CreatePoll.tsx
│   ├── Header.tsx
│   ├── PollCard.tsx
│   └── VoteModal.tsx
├── hooks
│   ├── useContract.ts
│   └── useWallet.ts
├── pages
│   ├── Dashboard.tsx
│   ├── Home.tsx
│   └── Polls.tsx
└── utils
    ├── PredictionPollABI.json
    └── web3.js
```

## Key Components and Logic

*   **`useWallet.ts`:** A custom hook that manages the wallet connection state (provider, signer, address, etc.) using `ethers`. It provides a simple interface for connecting and disconnecting the wallet.
*   **`useContract.ts`:** A custom hook that provides a memoized instance of the `ethers` contract, ready to be used with a signer for write operations.
*   **`web3.js`:** A utility file that contains all the functions for interacting with the smart contract. It separates read-only functions (using a provider) from write functions (using a signer).
*   **`Polls.tsx`:** The main page for displaying a list of all polls. It fetches poll data from the blockchain and handles filtering, searching, and pagination.
*   **`PollCard.tsx`:** A reusable component that displays a single poll with its relevant information.
*   **`CreatePoll.tsx`:** A form for creating new polls. It takes user input, validates it, and calls the `createPoll` function in `web3.js`.
*   **`VoteModal.tsx`:** A modal that allows users to vote on a poll. It takes the user's prediction and the amount of ETH to stake.
*   **`Header.tsx`:** The main navigation component, which also displays the wallet connection status and user address.
*   **`Home.tsx`:** The landing page of the application, providing a brief introduction and quick access to creating and exploring polls.
*   **`Dashboard.tsx`:** A page where users can see their past predictions and claim rewards (implementation pending).

## Design and Styling

*   **Theme:** Dark mode, with a modern and clean aesthetic.
*   **Layout:** Responsive design using Tailwind CSS utility classes.
*   **Colors:** A palette of grays, blues, and purples for a professional look.
*   **Typography:** Clear and legible fonts for a good user experience.
*   **Interactivity:** Subtle animations and hover effects to provide visual feedback.

## Current Status & Next Steps

The application is currently in a functional state, with all the core features implemented. The next steps in the development process would be:

*   **Implement `Dashboard.tsx`:** Create the logic to fetch and display a user's past predictions and claimable rewards.
*   **Add More Robust Error Handling:** Implement more specific error messages based on contract reverts and other potential issues.
*   **Write Unit and Integration Tests:** Use a testing framework like Vitest and React Testing Library to ensure the application is working as expected.
*   **Improve UI/UX:** Add more loading indicators, optimistic UI updates, and other features to improve the user experience.
*   **Deploy to a Testnet/Mainnet:** Deploy the application to a public network to make it accessible to everyone.
