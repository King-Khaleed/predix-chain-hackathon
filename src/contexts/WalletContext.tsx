import React, { createContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface WalletContextType {
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
    address: string | null;
    isConnected: boolean;
    loading: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

export const WalletContext = createContext<WalletContextType>({
    provider: null,
    signer: null,
    address: null,
    isConnected: false,
    loading: false,
    connectWallet: async () => {},
    disconnectWallet: () => {},
});

interface WalletProviderProps {
    children: React.ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetState = () => {
        setIsConnected(false);
        setAddress(null);
        setSigner(null);
        setProvider(null);
    }

    const disconnectWallet = useCallback(() => {
        resetState();
        localStorage.setItem('wallet_disconnected_manually', 'true');
        toast.success("Wallet disconnected.");
    }, []);

    const connectWallet = useCallback(async (isAutoConnect = false) => {
        if (!window.ethereum) {
            if (!isAutoConnect) toast.error("No wallet found. Please install a Web3 wallet (e.g., MetaMask).");
            return;
        }

        setLoading(true);
        try {
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await newProvider.send(isAutoConnect ? "eth_accounts" : "eth_requestAccounts", []);

            if (accounts.length > 0) {
                const signerInstance = await newProvider.getSigner();
                const userAddress = await signerInstance.getAddress();
                
                setProvider(newProvider);
                setSigner(signerInstance);
                setAddress(userAddress);
                setIsConnected(true);
                localStorage.removeItem('wallet_disconnected_manually'); // Clear flag on successful connect
                if (!isAutoConnect) toast.success("Wallet connected successfully!");
            } else if (!isAutoConnect) {
                toast.error("Connection request rejected.");
                resetState();
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            if (!isAutoConnect) toast.error("Failed to connect wallet. Please try again.");
            resetState(); // Reset state on failure without setting manual disconnect flag
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (typeof window.ethereum === 'undefined') return;

        if (localStorage.getItem('wallet_disconnected_manually') !== 'true') {
            connectWallet(true);
        }

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                toast.error('Wallet disconnected. Please reconnect.');
                disconnectWallet();
            } else if (address !== accounts[0]) {
                toast.info('Account switched. Re-connecting...');
                connectWallet(false);
            }
        };

        const handleChainChanged = () => {
            toast.info('Network changed. Reloading the page...');
            window.location.reload();
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            if (window.ethereum?.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [connectWallet, disconnectWallet, address]);

    return (
        <WalletContext.Provider value={{ provider, signer, address, isConnected, loading, connectWallet: () => connectWallet(false), disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};
