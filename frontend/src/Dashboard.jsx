import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';

// Mock data for development (replace with API data)
const mockTasks = [
  { id: '1', title: 'Complete Q2 Report', description: 'Finish quarterly report for team', dueDate: '2025-06-15', status: 'To Do' },
  { id: '2', title: 'Plan Community Event', description: 'Organize study group meetup', dueDate: '2025-06-20', status: 'To Do' },
  { id: '3', title: 'Update Profile', description: 'Add profile picture and bio', dueDate: '2025-06-18', status: 'In Progress' },
];
const mockCommunities = [
  { id: '1', name: 'Study Group', description: 'Collaborate on learning projects' },
  { id: '2', name: 'Fitness Club', description: 'Track fitness goals together' },
  { id: '3', name: 'Book Club', description: 'Discuss monthly book picks' },
];
const mockPoints = { totalPoints: 150 };

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
  });
  const [formError, setFormError] = useState('');
  const userId = 'user123'; // Replace with actual user ID from auth context or localStorage

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch tasks
        const tasksResponse = await axios.get(`http://localhost:8080/api/tasks/user/${userId}`, config);
        setTasks(tasksResponse.data.slice(0, 5)); // Limit to 5 tasks
        // Fetch communities
        const communitiesResponse = await axios.get(`http://localhost:8080/api/communities/user/${userId}`, config);
        setCommunities(communitiesResponse.data.slice(0, 3)); // Limit to 3 communities
        // Fetch points
        const pointsResponse = await axios.get(`http://localhost:8080/api/users/${userId}/points`, config);
        setPoints(pointsResponse.data.totalPoints);
      } catch (err) {
        // Fallback to mock data on error
        setTasks(mockTasks);
        setCommunities(mockCommunities);
        setPoints(mockPoints.totalPoints);
        setError('Failed to fetch data. Using mock data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle task completion (mock implementation)
  const handleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Done' } : task
    ));
    // TODO: Call API to update task status (e.g., PATCH /api/tasks/{taskId})
  };

  // Open/close modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setFormData({ title: '', description: '', dueDate: '', status: 'To Do' });
    setFormError('');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const newTask = {
        ...formData,
        userId,
        dueDate: formData.dueDate || null, // Handle empty due date
      };
      const response = await axios.post('http://localhost:8080/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([response.data, ...tasks].slice(0, 5)); // Add new task, keep max 5
      toggleModal();
    } catch (err) {
      setFormError('Failed to add task. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, User!
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Task List Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2 text-blue-500" />
              Your Tasks
            </h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            ) : (
              <>
                {tasks.length === 0 ? (
                  <p className="text-gray-500">No tasks found.</p>
                ) : (
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <div key={task.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <p className="text-sm text-gray-500">Due: {task.dueDate || 'None'}</p>
                          </div>
                          <button
                            onClick={() => handleTaskComplete(task.id)}
                            disabled={task.status === 'Done'}
                            className={`p-2 rounded-full ${task.status === 'Done' ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-100'}`}
                            aria-label={`Mark ${task.title} as complete`}
                          >
                            <CheckCircleIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={toggleModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    aria-label="Add new task"
                  >
                    Add Task
                  </button>
                  <Link to="/tasks" className="text-blue-500 hover:underline" aria-label="View all tasks">
                    View All
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Communities and Points Section */}
          <div className="space-y-6">
            {/* Communities Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <UserGroupIcon className="h-6 w-6 mr-2 text-blue-500" />
                Your Communities
              </h2>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : (
                <>
                  {communities.length === 0 ? (
                    <p className="text-gray-500">No communities joined.</p>
                  ) : (
                    <div className="space-y-4">
                      {communities.map(community => (
                        <div key={community.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h3 className="text-lg font-medium text-gray-800">{community.name}</h3>
                          <p className="text-sm text-gray-600">{community.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link to="/communities" className="mt-4 block text-blue-500 hover:underline" aria-label="See more communities">
                    See More
                  </Link>
                </>
              )}
            </div>

            {/* Points Display */}
            <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center">
                <StarIcon className="h-6 w-6 mr-2 text-yellow-500" />
                Your Points
              </h2>
              <p className="text-4xl font-bold text-blue-600 mt-2 animate-pulse">
                {points}
              </p>
            </div>

            {/* Join Community CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold">Discover New Communities</h2>
              <p className="text-sm mt-2">Join vibrant groups and collaborate with others!</p>
              <Link
                to="/communities/search"
                className="mt-4 inline-block px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100"
                aria-label="Join a new community"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>

        {/* Add Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h3>
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
                    aria-required="true"
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
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    aria-label="Cancel adding task"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    aria-label="Save new task"
                  >
                    Save
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

export default Dashboard;