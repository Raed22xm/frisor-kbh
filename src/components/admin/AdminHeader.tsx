"use client";

import { Bell, Search, UserCircle } from "lucide-react";

export function AdminHeader({ adminName }: { adminName: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex flex-1 items-center">
        {/* Search or Date Filter Placeholder */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
            placeholder="Search bookings..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-gray-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{adminName}</span>
        </div>
      </div>
    </header>
  );
}
