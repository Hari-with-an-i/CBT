import React from 'react';
import { Link } from 'react-router-dom';
import LogoBlack from './assets/LogoBlack.png';

const Navbar = () => {
  return (
    <nav className="bg-red-200 text-white p-0.05 m-0.05 shadow-md">
      <div className="container mx-0.05 flex justify-between items-center">
        {/* Logo/Title */}
                            <a href="/" className="-m-0.5 p-0.5">
                                <span className="sr-only">Your Company</span>
                                <img
                                    alt=""
                                    src={LogoBlack}
                                    className="h-16 w-auto"
                                />
                            </a>
        

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-6 text-black p-2">
          <Link
            to="/communities/search"
            className="hover:text-white transition-colors"
            aria-label="Join a community"
          >
            Join Community
          </Link>
          <Link
            to="/communities/create"
            className="hover:text-white transition-colors"
            aria-label="Create a community"
          >
            Create Community
          </Link>
          <Link
            to="/Dashboard"
            className="hover:text-white transition-colors"
            aria-label="Dashboard"
          >
            Dashboard
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded="false"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu (Hidden by default, shown on button click) */}
        <div className="md:hidden hidden">
          <div className="flex flex-col space-y-2 mt-2">
            <Link
              to="/communities/search"
              className="hover:text-blue-200 transition-colors"
              aria-label="Join a community"
            >
              Join Community
            </Link>
            <Link
              to="/communities/create"
              className="hover:text-blue-200 transition-colors"
              aria-label="Create a community"
            >
              Create Community
            </Link>
            <Link
              to="/Dashboard"
              className="hover:text-blue-200 transition-colors"
              aria-label="Dashboard"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;