import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import "./Components/SidebarPattern.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const url = `http://localhost:8080/api/auth/${isLogin ? "login" : "signup"}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setForm({ email: "", password: "", confirmPassword: "" });
        if (!isLogin) {
          setIsLogin(true); 
        } else {
          navigate("/ToDo");
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Network error: Unable to reach backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen pattern bg-gray-50 dark:bg-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200 z-10">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-white"
              onChange={handleChange}
              value={form.email}
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-white"
              onChange={handleChange}
              value={form.password}
              disabled={loading}
            />
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
                onChange={handleChange}
                value={form.confirmPassword}
                disabled={loading}
              />
            )}
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition duration-300"
              disabled={loading}
            >
              {loading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Login" : "Sign Up")}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-white">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-purple-600 hover:underline font-medium"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;