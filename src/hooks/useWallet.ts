import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import { toast } from 'react-hot-toast';

interface WalletState {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const useWallet = (): WalletState => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask not detected. Please install it to connect.');
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const signer = await browserProvider.getSigner();
        setProvider(browserProvider);
        setSigner(signer);
        setAddress(accounts[0]);
        setIsConnected(true);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setIsConnected(false);
    toast.success('Wallet disconnected.');
  }, []);

  // Listen for account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has disconnected
        disconnect();
      } else if (address !== accounts[0]) {
        // Re-connect with the new account
        connect();
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [address, connect, disconnect]);

  return { provider, signer, address, isConnected, connect, disconnect };
};

export default useWallet;
