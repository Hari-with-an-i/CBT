import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Components/SidebarPattern.css";
import NavBar from "./Components/Navbar";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const url = `http://localhost:8080/api/auth/${isLogin ? "login" : "signup"}`;
      console.log(`Sending request to: ${url}`);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      console.log(`Response status: ${response.status}`);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setForm({ email: "", password: "", confirmPassword: "" });
        if (!isLogin) {
          setIsLogin(true);
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          navigate("/Dashboard");
        }
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Network error details:", error);
      setError(`Unable to reach the backend: ${error.message}. Please check your connection or server status.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen pattern bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <NavBar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200 z-10">
          <h2 className="text-3xl font-bold text-center text-gray-200 mb-6">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
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
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none text-white"
                onChange={handleChange}
                value={form.confirmPassword}
                disabled={loading}
              />
            )}
            <button
              type="submit"
              className="w-full py-2 bg-gray-600 hover:bg-gray-400 text-white rounded-full transition duration-300 flex items-center justify-center"
              disabled={loading}
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
                  {isLogin ? "Logging in..." : "Signing up..."}
                </>
              ) : (
                <>{isLogin ? "Login" : "Sign Up"}</>
              )}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-200">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-gray-400 hover:underline font-medium"
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