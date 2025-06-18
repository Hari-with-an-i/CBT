import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import "./Components/SidebarPattern.css";

const Community = () => {
    const [form, setForm] = useState({ name: "", description: "", ownerId: "", type: "public" });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Added for navigation

    const apiUrl = "http://localhost:8080/api/community";

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingId ? `${apiUrl}/${editingId}` : apiUrl;
            const method = editingId ? "PUT" : "POST";
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) {
                alert(editingId ? "Community updated successfully" : "Community created successfully");
                resetForm();
                navigate("../ToDo");
            } else {
                alert(data.error || "Failed to save community");
            }
        } catch (error) {
            alert("Network error: Unable to reach backend");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ name: "", description: "", ownerId: "", type: "public" });
        setEditingId(null);
    };

    return (
        <div className="relative w-screen h-screen pattern bg-gray-50 dark:bg-slate-900 overflow-hidden">
            <Sidebar />
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-2xl border border-gray-200 z-10">
                    <h2 className="text-3xl font-bold text-center text-white mb-6">
                        {editingId ? "Edit Community" : "Create Community"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Community Name"
                            required
                            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-white"
                            onChange={handleChange}
                            value={form.name}
                            disabled={loading}
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-white"
                            onChange={handleChange}
                            value={form.description}
                            disabled={loading}
                        />
                        <input
                            type="text"
                            name="ownerId"
                            placeholder="Email" 
                            required
                            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-white"
                            onChange={handleChange}
                            value={form.ownerId}
                            disabled={loading}
                        />
                        <select
                            name="type"
                            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-gray-400"
                            onChange={handleChange}
                            value={form.type}
                            disabled={loading}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                        <div className="flex justify-center space-x-4">
                            <button
                                type="submit"
                                className="py-2 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition duration-300"
                                disabled={loading}
                            >
                                {loading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update" : "Create")}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition duration-300"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Community;   