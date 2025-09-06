import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          Prediction Polls
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-gray-600 hover:text-purple-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/polls" className="text-gray-600 hover:text-purple-600">
                Polls
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-gray-600 hover:text-purple-600">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
