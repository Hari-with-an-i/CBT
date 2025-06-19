import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PencilSquareIcon, ClipboardDocumentListIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import "./Components/SidebarPattern.css";
import Navbar from './Navbar';

const CommunityDashboard = () => {
  const { communityId } = useParams();
  const [members, setMembers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [communityTasks, setCommunityTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    category: 'Community',
    memberEmails: [], // Array for selected members
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!communityId) {
        setError('No community ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const [membersResponse, topUsersResponse, tasksResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/communities/${communityId}/members`, config),
          axios.get(`http://localhost:8080/api/communities/${communityId}/top-users`, config),
          axios.get(`http://localhost:8080/api/communities/${communityId}/tasks`, config),
        ]);
        setMembers(membersResponse.data);
        setTopUsers(topUsersResponse.data);
        setCommunityTasks(tasksResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response) {
          setError(`Failed to fetch data: Status ${err.response.status} - ${err.response.data?.message || 'Resource not found'}`);
        } else {
          setError(`Failed to fetch data: ${err.message}`);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [communityId, token]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setFormData({ title: '', description: '', dueDate: '', status: 'Pending', category: 'Community', memberEmails: [] });
    setFormError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMemberChange = (e) => {
    const selectedEmails = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, memberEmails: selectedEmails });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (formData.memberEmails.length === 0) {
      setFormError('At least one member must be assigned');
      return;
    }

    setFormLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const newTask = {
        ...formData,
        communityId,
        dueDate: formData.dueDate || null,
      };
      const response = await axios.post(`http://localhost:8080/api/communities/${communityId}/tasks`, newTask, config);
      setCommunityTasks([response.data, ...communityTasks]);
      toggleModal();
    } catch (err) {
      console.error('Add task error:', err);
      setFormError(`Failed to add task: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pattern bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-6">Welcome Admin!</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 mr-2 text-gray-300" />
              Members List
            </h2>
            {loading && <p className="text-gray-300 text-center">Loading members...</p>}
            {!loading && !error && members.length === 0 && (
              <p className="text-gray-300 text-center">No members found.</p>
            )}
            {!loading && !error && members.length > 0 && (
              <ul className="space-y-2">
                {members.map((email, index) => (
                  <li key={index} className="text-gray-200 text-center">
                    {email}
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
            {loading && <p className="text-gray-300 text-center">Loading leaderboard...</p>}
            {!loading && !error && topUsers.length === 0 && (
              <p className="text-gray-300 text-center">No users on leaderboard.</p>
            )}
            {!loading && !error && topUsers.length > 0 && (
              <ol className="space-y-2 text-left">
                {topUsers.map((user, index) => (
                  <li key={user.id} className="text-gray-200">
                    {index + 1}. {user.email} - {user.points} points
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center justify-center">
            <PencilSquareIcon className="h-6 w-6 mr-2 text-gray-300" />
            Community Tasks
          </h2>
          {loading && <p className="text-gray-300 text-center">Loading tasks...</p>}
          {!loading && !error && communityTasks.length === 0 && (
            <p className="text-gray-300 text-center">No tasks assigned.</p>
          )}
          {!loading && !error && communityTasks.length > 0 && (
            <ul className="space-y-2">
              {communityTasks.map((task) => (
                <li key={task.id} className="text-gray-200">
                  {task.title} - Assigned to: {task.memberEmails.join(', ')}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={toggleModal}
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-300"
            aria-label="Add new community task"
          >
            Add Task
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Community Task</h3>
              {formError && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddTask}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={formLoading}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    disabled={formLoading}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={formLoading}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={formLoading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="memberEmails" className="block text-sm font-medium text-gray-700">
                    Assign to (Hold Ctrl to select multiple)
                  </label>
                  <select
                    id="memberEmails"
                    name="memberEmails"
                    multiple
                    value={formData.memberEmails}
                    onChange={handleMemberChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24"
                    disabled={formLoading}
                  >
                    <option value="all">All Members</option>
                    {members.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                    disabled={formLoading}
                  >
                    {formLoading ? (
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
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDashboard;