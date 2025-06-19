import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from './Navbar';
import "./Components/SidebarPattern.css";

const UserProfile = () => {
  const { userId } = useParams();
  const token = localStorage.getItem('token');
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    profilePic: null,
    communities: [],
    skills: [],
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:8080/api/users/${userId}/profile`, config);
        setProfile({
          username: response.data.username || '',
          bio: response.data.bio || '',
          profilePic: response.data.profilePic || null,
          communities: response.data.communities || [],
          skills: response.data.skills || [],
        });
        if (response.data.profilePic) {
          setPreview(`http://localhost:8080/api/users/${userId}/profile-pic`);
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSkillChange = (e) => {
    const skills = Array.from(e.target.selectedOptions, option => option.value);
    setProfile({ ...profile, skills });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePic: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please log in to save changes');
      return;
    }

    const formData = new FormData();
    formData.append('username', profile.username);
    formData.append('bio', profile.bio);
    if (profile.profilePic) formData.append('profilePic', profile.profilePic);
    profile.skills.forEach((skill, index) => formData.append(`skills[${index}]`, skill));

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      const response = await axios.put(`http://localhost:8080/api/users/${userId}/profile`, formData, config);
      setProfile({ ...profile, communities: response.data.communities });
      setError(null);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save profile');
    }
  };

  return (
    <div className="min-h-screen flex flex-col pattern bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 justify-center items-center flex-1">
        <h1 className="text-3xl font-bold text-gray-200 mb-6">User Profile</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-gray-700 p-6 rounded-lg shadow-md">
            <div className="mb-4 flex flex-col items-center justify-center">
              <label className="block text-gray-200 mb-2">Profile Picture</label>
              <div className="relative">
                <img
                  src={preview || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-gray-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-200 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-200 mb-2"> Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-200 mb-2">Communities</label>
              <ul className="list-disc pl-5 text-gray-200">
                {profile.communities.map((community, index) => (
                  <li key={index}>{community.name || community.id}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <label className="block text-gray-200 mb-2">Skills (Hold Ctrl to select multiple)</label>
              <select
                name="skills"
                multiple
                value={profile.skills}
                onChange={handleSkillChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="React">React</option>
                <option value="Spring Boot">Spring Boot</option>
                <option value="MongoDB">MongoDB</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;