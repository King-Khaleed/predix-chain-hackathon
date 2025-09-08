import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import WalletButton from './WalletButton';

const Header = () => {
    const { wallet } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!wallet) {
            e.preventDefault();
            alert('Please connect your wallet to view the dashboard.');
        }
        setIsMenuOpen(false); // Close menu on navigation
    };

    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = (
        <>
            <NavLink 
                to="/predictions"
                className={({ isActive }) => `px-3 py-2 rounded-md text-lg font-medium transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                onClick={closeMenu}
            >
                All Predictions
            </NavLink>
            <NavLink 
                to="/create-prediction"
                className={({ isActive }) => `px-3 py-2 rounded-md text-lg font-medium transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                onClick={closeMenu}
            >
                Create Prediction
            </NavLink>
            <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `px-3 py-2 rounded-md text-lg font-medium transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                onClick={handleDashboardClick}
            >
                Dashboard
            </NavLink>
        </>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="text-white text-2xl font-bold">
                            PrediX-Chain
                        </NavLink>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {navLinks}
                    </div>

                    {/* Desktop Wallet Button */}
                    <div className="hidden md:block">
                        <WalletButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger Icon */}
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-gray-900 md:hidden" id="mobile-menu">
                    <div className="flex justify-end p-4">
                         {/* Close Button */}
                        <button
                            onClick={closeMenu}
                            type="button"
                            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <span className="sr-only">Close menu</span>
                             {/* Close (X) Icon */}
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-6 pt-10 text-center">
                        {navLinks}
                        <div className="pt-6">
                            <WalletButton />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
