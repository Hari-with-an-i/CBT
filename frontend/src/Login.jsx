import React, { useState } from "react";
import Sidebar from "./Components/Sidebar";
import "./Components/SidebarPattern.css"; // Contains the .pattern class

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(isLogin ? "Logged in!" : "Signed up!");
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
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-white"
              onChange={handleChange}
              value={form.password}
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
              />
            )}
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition duration-300"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-white">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-purple-600 hover:underline font-medium"
              onClick={() => setIsLogin(!isLogin)}
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
