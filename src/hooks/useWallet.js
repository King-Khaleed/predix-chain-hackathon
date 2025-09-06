import { useState, useEffect } from 'react';
import { initProvider } from '../utils/web3';

const useWallet = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      const provider = await initProvider();
      setProvider(provider);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      const network = await provider.getNetwork();
      setChainId(network.chainId.toString());
      setIsConnected(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setAddress(null);
    setChainId(null);
    setIsConnected(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          disconnect();
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(chainId);
        // Force reload to re-initialize with the new chain's provider
        window.location.reload();
      });
    }
  }, []);

  return { connect, disconnect, address, chainId, isConnected, provider };
};

export default useWallet;
