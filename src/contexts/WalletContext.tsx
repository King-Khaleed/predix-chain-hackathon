
import React, { useState, useEffect, useCallback, createContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

// Define a global type for the window object to include ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}

// Define the shape of the context state
interface IWalletContext {
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
    address: string | null;
    isConnected: boolean;
    loading: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

// Create the context with a default value
export const WalletContext = createContext<IWalletContext | undefined>(undefined);

// Create the Provider component
interface WalletProviderProps {
    children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            toast.error("No wallet found. Please install a Web3 wallet (e.g., MetaMask).");
            return;
        }

        setLoading(true);
        try {
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            await newProvider.send("eth_requestAccounts", []);
            const signerInstance = await newProvider.getSigner();
            const userAddress = await signerInstance.getAddress();

            setProvider(newProvider);
            setSigner(signerInstance);
            setAddress(userAddress);
            setIsConnected(true);
            toast.success("Wallet connected successfully!");

        } catch (error) {
            console.error("Failed to connect wallet:", error);
            toast.error("Failed to connect wallet. The request may have been rejected.");
            // Reset state on failure
            setIsConnected(false);
            setAddress(null);
            setSigner(null);
            setProvider(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        setIsConnected(false);
        setAddress(null);
        setSigner(null);
        setProvider(null);
        toast.success("Wallet disconnected.");
    }, []);

    // Effect to handle account and network changes
    useEffect(() => {
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                connectWallet();
            } else {
                disconnectWallet();
            }
        };

        const handleChainChanged = () => {
            window.location.reload();
        };

        if (window.ethereum?.on) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum?.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [connectWallet, disconnectWallet]);

    const value = { provider, signer, address, isConnected, loading, connectWallet, disconnectWallet };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};
