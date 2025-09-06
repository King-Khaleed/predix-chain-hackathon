import React from 'react';
import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

// Helper to truncate the address
const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Header = () => {
    const { isConnected, address, connect, disconnect } = useWallet();

    return (
        <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-white">
                    🔮 Predicto
                </Link>
                <nav className="flex items-center space-x-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link to="/polls" className="text-gray-300 hover:text-white transition-colors">
                        All Polls
                    </Link>
                    <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                        My Dashboard
                    </Link>
                    {isConnected && address ? (
                        <div className="flex items-center space-x-4">
                             <span className="text-sm font-mono bg-gray-700 text-gray-300 px-3 py-1 rounded-md">
                                {truncateAddress(address)}
                            </span>
                            <button
                                onClick={disconnect}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connect}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Connect Wallet
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
