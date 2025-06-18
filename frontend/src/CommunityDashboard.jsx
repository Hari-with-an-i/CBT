import React, { useState, useEffect } from "react";
import { PencilSquareIcon, ClipboardDocumentListIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import "./Components/SidebarPattern.css";
import Navbar from './Navbar';

const CommunityDashboard = ({ communityId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        // Replace with your backend API URL
        const response = await axios.get(`http://localhost:8080/api/communities/${communityId}/members`);
        setMembers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch members');
        setLoading(false);
        console.error(err);
      }
    };

    if (communityId) {
      fetchMembers();
    }
  }, [communityId]);

  return (
    <div className="min-h-screen flex flex-col pattern bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-6">Welcome Admin!</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 mr-2 text-gray-300" />
              Members List
            </h2>
            {loading && <p className="text-gray-300 text-center">Loading members...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && members.length === 0 && (
              <p className="text-gray-300 text-center">No members found.</p>
            )}
            {!loading && !error && members.length > 0 && (
              <ul className="space-y-2">
                {members.map((memberId) => (
                  <li key={memberId} className="text-gray-100 text-center">
                    {memberId}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-100 flex items-center justify-center">
              <StarIcon className="h-6 w-6 mr-2 text-gray-300" />
              Leaderboard
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center justify-center">
              <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-gray-300" />
              Pending Tasks
            </h2>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-100 flex items-center justify-center">
              <PencilSquareIcon className="h-6 w-6 mr-2 text-gray-300" />
              Create Task
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityDashboard;