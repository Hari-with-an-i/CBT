'use client'

import Navbar from './Components/Navbar'
import './Components/SidebarPattern.css'

export default function Example() {

  return (
    <div className="relative w-screen h-screen pattern bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute -z-10 transform-gpu overflow-hidden sm:-top-80"
        >

        </div>
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-40">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-200 font-semibold">
              Welcome to{' '}
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-400 sm:text-7xl">
              Community Based Task Manager
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-200 sm:text-xl/8">
              Create, manage, and collaborate on tasks with your community.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/Login"
                className="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
        </div>
      </div>
    </div>
  )
}
