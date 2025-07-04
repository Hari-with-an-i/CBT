import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import "./Components/SidebarPattern.css";

const CommunityCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  console.log('Token for community create:', token); // Debug log

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Community name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log('Sending community create request with token:', token); // Debug log
      const response = await axios.post(
        'http://localhost:8080/api/communities',
        { ...formData, userId },
        config
      );
      setSuccess('Community created successfully!');
      setTimeout(() => navigate('/Dashboard'), 2000);
    } catch (err) {
      console.error('Create community error:', err);
      setError(err.response?.data?.message || 'Failed to create community. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pattern bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="sticky top-0 w-full z-10">
        <Navbar />
      </div>
      <div className="flex flex-grow items-center justify-center">
        <div className="border border-gray-500 p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Create a Community</h2>
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                Community Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                required
                aria-required="true"
                disabled={loading}
                aria-label="Community name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-200">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                rows="4"
                disabled={loading}
                aria-label="Community description"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-500 text-gray-200 rounded-lg hover:bg-gray-400 flex items-center justify-center"
              disabled={loading}
              aria-label="Create community"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l-3 3h-5z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Community'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommunityCreate;