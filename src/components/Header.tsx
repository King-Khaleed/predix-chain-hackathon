import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Header = () => {
    const { isConnected, address, connectWallet, disconnectWallet, loading } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getNavLinkClassName = ({ isActive }: { isActive: boolean }) => {
        const commonClasses = 'text-lg px-3 py-2 rounded-md font-medium transition-colors duration-200';
        return isActive ? `text-white ${commonClasses}` : `text-gray-300 hover:text-white ${commonClasses}`;
    };

    const handleDashboardClick = (e: React.MouseEvent) => {
        if (!isConnected) {
            e.preventDefault();
            connectWallet(); // Use the correct function name
        }
        setIsMenuOpen(false);
    };

    const navLinks = (
        <>
            <NavLink to="/" className={getNavLinkClassName} onClick={() => setIsMenuOpen(false)}>
                Home
            </NavLink>
            <NavLink to="/polls" className={getNavLinkClassName} onClick={() => setIsMenuOpen(false)}>
                All Polls
            </NavLink>
            <NavLink to="/dashboard" className={getNavLinkClassName} onClick={handleDashboardClick}>
                My Dashboard
            </NavLink>
        </>
    );

    const walletButton = (
        <> 
            {isConnected && address ? (
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-mono bg-gray-800 text-gray-300 px-3 py-2 rounded-lg shadow-inner">
                        {truncateAddress(address)}
                    </span>
                    <button onClick={disconnectWallet} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                        Disconnect
                    </button>
                </div>
            ) : (
                <button onClick={connectWallet} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md flex items-center space-x-2 disabled:opacity-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m-4-4l4 4m0 0l-4 4m4-4H7" /></svg>
                    <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
            )}
        </>
    );

    return (
        <header className="bg-gray-900 border-b border-gray-800 shadow-2xl sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-3xl font-bold text-white" style={{ fontFamily: `'Orbitron', sans-serif` }}>
                            🔮 PREDICTO
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center space-x-4">{navLinks}</nav>
                    <div className="hidden md:block">{walletButton}</div>
                    
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">{navLinks}</div>
                    <div className="pt-4 pb-3 border-t border-gray-700 px-5">{walletButton}</div>
                </div>
            )}
        </header>
    );
};

export default Header;
