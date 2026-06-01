"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSidebarStore } from "./sidebar-store";
import { useNotificationStore } from "./notifications-store";
import { useActivityStore } from "./activity-store";

import {
  HomeIcon,
  BriefcaseIcon,
  CurrencyPoundIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  BellIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ currentPath }: { currentPath: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { mobileOpen, setMobileOpen } = useSidebarStore();
  const { notifications, setOpen: openNotifications } = useNotificationStore();
  const { setOpen: openActivity } = useActivityStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* Keyboard shortcut: Ctrl/Cmd + B */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const combo = isMac ? e.metaKey && e.key === "b" : e.ctrlKey && e.key === "b";

      if (combo) {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const linkClasses = (path: string) =>
    `group relative flex items-center gap-3 p-2 rounded transition ${
      currentPath === path
        ? "bg-blue-600 text-white"
        : "hover:bg-gray-200 text-gray-800"
    }`;

  const Tooltip = ({ label }: { label: string }) =>
    collapsed ? (
      <span className="absolute left-20 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {label}
      </span>
    ) : null;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          bg-gray-100 border-r p-6 space-y-6
          transition-all duration-300
        `}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <Bars3Icon className="w-6 h-6" />
          {!collapsed && <span className="font-semibold">Collapse</span>}
        </button>

        {/* Notifications */}
        <button
          onClick={() => openNotifications(true)}
          className="group relative flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition"
        >
          <BellIcon className="w-5 h-5 text-gray-700" />
          {!collapsed && <span>Notifications</span>}
          {collapsed && <Tooltip label="Notifications" />}

          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 bg-red-600 text-white text-xs rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Activity Feed */}
        <button
          onClick={() => openActivity(true)}
          className="group relative flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition"
        >
          <ClockIcon className="w-5 h-5 text-gray-700" />
          {!collapsed && <span>Recent Activity</span>}
          {collapsed && <Tooltip label="Recent Activity" />}
        </button>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link href="/dashboard" className={linkClasses("/dashboard")}>
            <HomeIcon className="w-5 h-5" />
            {!collapsed && "Dashboard"}
            <Tooltip label="Dashboard" />
          </Link>

          <Link href="/jobs" className={linkClasses("/jobs")}>
            <BriefcaseIcon className="w-5 h-5" />
            {!collapsed && "My Jobs"}
            <Tooltip label="My Jobs" />
          </Link>

          <Link href="/dashboard/bids" className={linkClasses("/dashboard/bids")}>
            <CurrencyPoundIcon className="w-5 h-5" />
            {!collapsed && "My Bids"}
            <Tooltip label="My Bids" />
          </Link>

          <Link href="/dashboard/work" className={linkClasses("/dashboard/work")}>
            <ClipboardDocumentListIcon className="w-5 h-5" />
            {!collapsed && "My Work"}
            <Tooltip label="My Work" />
          </Link>

          <Link
            href="/dashboard/completed"
            className={linkClasses("/dashboard/completed")}
          >
            <CheckCircleIcon className="w-5 h-5" />
            {!collapsed && "Completed Jobs"}
            <Tooltip label="Completed Jobs" />
          </Link>

          <Link href="/profile/edit" className={linkClasses("/profile/edit")}>
            <UserCircleIcon className="w-5 h-5" />
            {!collapsed && "Profile"}
            <Tooltip label="Profile" />
          </Link>
        </nav>

        {/* User Avatar Menu */}
        <div className="mt-10 relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition w-full"
          >
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
              R
            </div>

            {!collapsed && (
              <>
                <span className="font-medium">Richard</span>
                <ChevronDownIcon className="w-4 h-4 ml-auto" />
              </>
            )}
          </button>

          {menuOpen && !collapsed && (
            <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-lg p-2 space-y-1 z-50">
              <Link
                href="/profile/edit"
                className="block px-3 py-2 rounded hover:bg-gray-100"
              >
                View Profile
              </Link>

              <Link
                href="/settings"
                className="block px-3 py-2 rounded hover:bg-gray-100"
              >
                Account Settings
              </Link>

              <form action="/api/auth/signout" method="post">
                <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-600">
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
