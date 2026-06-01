"use client";

import { useNotificationStore } from "./notifications-store";

export default function NotificationsPanel() {
  const { open, setOpen, notifications, markRead } = useNotificationStore();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <aside
        className={`
          fixed right-0 top-0 h-full w-80 bg-white border-l shadow-xl z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-full">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded border ${
                n.read ? "bg-gray-100" : "bg-blue-50 border-blue-300"
              }`}
              onClick={() => markRead(n.id)}
            >
              <h3 className="font-medium">{n.title}</h3>
              <p className="text-sm text-gray-700">{n.message}</p>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
