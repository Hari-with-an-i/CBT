import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from './Navbar';
import "./Components/SidebarPattern.css";

const Dashboard = () => {
  const navigate = useNavigate();
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
    status: 'Pending',
    category: 'Personal',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState({});

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId || !token) {
      setError('You must be logged in to access the dashboard.');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log(`Fetching tasks for user: ${userId}`);
        const tasksResponse = await axios.get(`http://localhost:8080/api/tasks/user/${userId}`, config);
        console.log('Tasks response:', tasksResponse.data);
        setTasks(tasksResponse.data.slice(0, 5));

        console.log(`Fetching communities for user: ${userId}`);
        const communitiesResponse = await axios.get(`http://localhost:8080/api/communities/user/${userId}`, config);
        console.log('Communities response:', communitiesResponse.data);
        setCommunities(communitiesResponse.data.slice(0, 3));

        console.log(`Fetching points for user: ${userId}`);
        const pointsResponse = await axios.get(`http://localhost:8080/api/users/${userId}/points`, config);
        console.log('Points response:', pointsResponse.data);
        setPoints(pointsResponse.data.totalPoints || 0);
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setTimeout(() => navigate('/'), 3000);
        } else {
          setError(`Failed to fetch data: ${err.message}. Please try again later.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token, navigate]);

  const handleTaskComplete = async (taskId) => {
    setTaskLoading((prev) => ({ ...prev, [taskId]: true }));
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      console.log(`Marking task ${taskId} as Completed`);
      const response = await axios.patch(`http://localhost:8080/api/tasks/${taskId}`, { status: 'Completed' }, config);
      console.log(`Task ${taskId} updated:`, response.data);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: 'Completed' } : task
      ));

      await new Promise(resolve => setTimeout(resolve, 500));
      const pointsResponse = await axios.get(`http://localhost:8080/api/users/${userId}/points`, config);
      console.log('Updated points response:', pointsResponse.data);
      setPoints(pointsResponse.data.totalPoints || 0);
    } catch (err) {
      console.error('Task completion error:', err);
      setError(`Failed to complete task: ${err.message}`);
    } finally {
      setTaskLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, config);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Delete task error:', err);
      setError('Failed to delete task: ' + err.message);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setFormData({ title: '', description: '', dueDate: '', status: 'Pending', category: 'Personal' });
    setFormError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    setFormLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const newTask = {
        ...formData,
        userId,
        dueDate: formData.dueDate || null,
      };
      console.log('Creating new task:', newTask);
      const response = await axios.post('http://localhost:8080/api/tasks', newTask, config);
      console.log('Task created:', response.data);
      setTasks([response.data, ...tasks].slice(0, 5));
      toggleModal();
    } catch (err) {
      console.error('Add task error:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired or access denied. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setFormError(`Failed to add task: ${err.message}`);
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen pattern bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-200 mb-6">
          Welcome, User!
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-200 mb-.​4 flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2 text-gray-300" />
              Your Tasks
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-gray-500">No tasks found.</p>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 bg-gray-300 rounded-lg border border-gray-200"
                              role="listitem"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
                                  <p className="text-sm text-gray-600">{task.description}</p>
                                  <p className="text-sm text-gray-500">
                                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                                  </p>
                                  <p className="text-sm text-gray-500">Category: {task.category || 'Personal'}</p>
                                  <div className="mt-2">
                                    <select
                                      value={task.status}
                                      onChange={(e) => {
                                        if (e.target.value === 'Completed') {
                                          handleTaskComplete(task.id);
                                        }
                                      }}
                                      className="p-1 border rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                      aria-label={`Change status for task ${task.title}`}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="In Progress">In Progress</option>
                                      <option value="Completed">Completed</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleTaskComplete(task.id)}
                                    disabled={task.status === 'Completed' || taskLoading[task.id]}
                                    className={`p-2 rounded-full flex items-center justify-center ${
                                      task.status === 'Completed'
                                        ? 'text-green-700'
                                        : taskLoading[task.id]
                                        ? 'text-gray-400'
                                        : 'text-gray-500 hover:bg-gray-200'
                                    }`}
                                    aria-label={`Mark ${task.title} as complete`}
                                  >
                                    {taskLoading[task.id] ? (
                                      <svg
                                        className="animate-spin h-6 w-6 text-blue-500"
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
                                    ) : (
                                      <CheckCircleIcon className="h-6 w-6" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-red-600 hover:text-red-800 p-2 rounded-full"
                                    aria-label={`Delete task ${task.title}`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
            <div className="mt-4 flex justify-between">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-300"
                aria-label="Add new task"
              >
                Add Task
              </button>
              <Link to="/tasks" className="text-gray-200 hover:underline" aria-label="View all tasks">
                View All
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                <UserGroupIcon className="h-6 w-6 mr-2 text-gray-300" />
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
                        <Link
                          key={community.id}
                          to={`/communities/${community.id}`}
                          className="block p-4 bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-300 transition-colors"
                          aria-label={`View community ${community.name}`}
                        >
                          <h3 className="text-lg font-medium text-gray-800">{community.name}</h3>
                          <p className="text-sm text-gray-600">{community.description}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link to="/communities" className="mt-4 block text-gray-200 hover:underline" aria-label="See more communities">
                    See More
                  </Link>
                </>
              )}
            </div>

            <div className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold text-gray-200 flex items-center justify-center">
                <StarIcon className="h-6 w-6 mr-2 text-yellow-500" />
                Your Points
              </h2>
              <p className="text-4xl font-bold text-gray-200 mt-2 animate-pulse">
                {points}
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-500 to-gray-700 text-gray-200 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold">Discover New Communities</h2>
              <p className="text-sm mt-2">Join vibrant groups and collaborate with others!</p>
              <Link
                to="/communities/search"
                className="mt-4 inline-block px-6 py-2 bg-gray-400 text-gray-200 font-medium rounded-lg hover:bg-gray-500"
                aria-label="Join a new community"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>

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
                    disabled={formLoading}
                    aria-label="Task title"
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
                    aria-label="Task description"
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
                    aria-label="Task due date"
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
                    aria-label="Task status"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={formLoading}
                    aria-label="Task category"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    aria-label="Cancel adding task"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                    aria-label="Save new task"
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

export default Dashboard;