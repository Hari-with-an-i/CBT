import React from "react";
import "./SidebarPattern.css"; // We'll move the pattern background here
import ToDo from './Div';

const Sidebar = () => {
  return (
      <nav className="z-20 fixed top-1/2 -translate-y-1/2 left-6 flex flex-col justify-around gap-4 border border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-800/50 min-h-[auto] min-w-[64px] rounded-lg">
        {/* Profile */}
        <a
          href="#profile"
          className="flex aspect-square w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 bg-indigo-50 text-indigo-600 dark:bg-sky-900 dark:text-sky-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0A17.934 17.934 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.632z"
            />
          </svg>
          <small className="text-center text-xs font-medium">Profile</small>
        </a>

        {/* Analytics */}
        <a
          href="ToDo"
          className="flex aspect-square w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
          <small className="text-center text-xs font-medium">ToDo</small>
        </a>

        {/* Settings */}
        <a
          href="#settings"
          className="flex aspect-square w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94a1.125 1.125 0 011.11-.94h2.593a1.125 1.125 0 011.11.94l.213 1.281c.063.374.313.686.645.87l.22.127c.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124l-.22.128c-.331.183-.581.495-.644.869l-.213 1.28a1.125 1.125 0 01-1.11.941h-2.594a1.125 1.125 0 01-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87l-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124l.22-.128c.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <small className="text-center text-xs font-medium">Settings</small>
        </a>

        <hr className="dark:border-gray-700/60" />

        {/* Home */}
        <a
          href="/"
          className="flex h-16 w-16 flex-col items-center justify-center gap-1 text-fuchsia-900 dark:text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
            />
          </svg>
          <small className="text-xs font-medium">Home</small>
        </a>
      </nav>
  );
};

export default Sidebar;
