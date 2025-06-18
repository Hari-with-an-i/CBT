import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <div className="text-xl font-bold">CBT Dashboard</div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-6">
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
            to="/tasks"
            className="hover:text-blue-200 transition-colors"
            aria-label="View all tasks"
          >
            View All Tasks
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
              to="/tasks"
              className="hover:text-blue-200 transition-colors"
              aria-label="View all tasks"
            >
              View All Tasks
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;