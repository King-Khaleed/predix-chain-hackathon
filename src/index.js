import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// To run locally: npm install -> npm start
// To demo:
// 1. Compile and deploy PredictionPoll.sol to BlockDAG testnet.
// 2. Set REACT_APP_CONTRACT_ADDRESS in a .env file.
// 3. Connect MetaMask to BlockDAG testnet (https://rpc.primordial.bdagscan.com, Chain ID: 1043).
// 4. Fund your account with tDAG from a faucet.
// 5. Create a poll, make a prediction, resolve the poll, and claim your reward.
// Troubleshooting:
// - Wrong chainId: Make sure you are connected to the BlockDAG testnet.
// - Missing ABI: Ensure the ABI in src/utils/PredictionPollABI.json is correct.
// - Insufficient gas: Make sure your account has enough tDAG to pay for transactions.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
