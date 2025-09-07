import { Link, useLocation } from 'react-router-dom';
import useWallet from '../hooks/useWallet'; // Corrected import
import { UserCircleIcon, WalletIcon } from '@heroicons/react/24/outline';

const NavBar = () => {
    // Correctly use the global useWallet hook
    const { address, isConnected, connectWallet, disconnectWallet, loading } = useWallet();
    const location = useLocation();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/polls', label: 'All Polls' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/create-poll', label: 'Create Poll' },
    ];

    return (
        <nav className="bg-gray-800/50 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-700 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-white" style={{ fontFamily: `'Orbitron', sans-serif` }}>
                        Predi<span className="text-indigo-400">X-</span>Chain
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`text-lg transition-colors duration-300 ${location.pathname === link.href ? 'text-indigo-400 font-semibold' : 'text-gray-300 hover:text-white'
                                    }`}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Wallet Button */}
                    <div>
                        {isConnected && address ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center bg-gray-700/50 rounded-full p-2">
                                    <UserCircleIcon className="h-6 w-6 text-indigo-400" />
                                    <span className="text-white font-mono ml-2 text-sm">{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</span>
                                </div>
                                <button
                                    onClick={disconnectWallet} // Corrected function call
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet} // Corrected function call
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 inline-flex items-center">
                                <WalletIcon className="h-5 w-5 mr-2" />
                                {loading ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
