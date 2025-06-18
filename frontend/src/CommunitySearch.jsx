import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'
import "./Components/SidebarPattern.css";


const CommunitySearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  console.log('Token for community search:', token); // Debug log

  useEffect(() => {
    if (!userId || !token) {
      setError('You must be logged in to search communities.');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    const fetchCommunities = async () => {
      setLoading(true);
      setError('');
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('Searching communities with query:', query);
        const response = await axios.get(`http://localhost:8080/api/communities/search?name=${query}`, config);
        console.log('Search results:', response.data);
        setCommunities(response.data);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search communities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [query, userId, token, navigate]);

  const handleJoin = async (communityId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log(`Joining community ${communityId} with userId ${userId}`);
      const response = await axios.post(
        `http://localhost:8080/api/communities/${communityId}/join`,
        { userId },
        config
      );
      console.log('Join response:', response.data);
      setSuccess('Successfully joined the community!');
      setCommunities(communities.map(c => c.id === communityId ? response.data : c));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Join error:', err);
      setError(err.response?.data?.message || 'Failed to join community.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen pattern bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navbar />
      <h2 className="text-2xl font-semibold text-gray-200 mb-4 p-4">Search Communities</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search communities by name..."
          className="w-full text-white p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-600"
          aria-label="Search communities"
          disabled={loading}
        />
      </div>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : communities.length === 0 ? (
        <p className="text-gray-500">No communities found.</p>
      ) : (
        <div className="space-y-4">
          {communities.map(community => (
            <div key={community.id} className="p-4 bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-200">{community.name}</h3>
              <p className="text-sm text-gray-200">{community.description || 'No description available'}</p>
              <p className="text-sm text-gray-200 mt-2">
                Members: {community.memberIds?.length || 0}
              </p>
              <button
                onClick={() => handleJoin(community.id)}
                className="mt-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg hover:bg-gray-200 disabled:bg-gray-400"
                disabled={community.memberIds?.includes(userId) || loading}
                aria-label={`Join ${community.name}`}
              >
                {community.memberIds?.includes(userId) ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunitySearch;