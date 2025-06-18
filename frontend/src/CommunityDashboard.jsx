import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Components/SidebarPattern.css";
import Navbar from './Navbar';

const CommunityDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col pattern bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-center text-red-200 mb-6">Welcome Admin!</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              Member List
            </h2>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CommunityDashboard;