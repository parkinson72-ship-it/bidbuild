"use client";

import { useActivityStore } from "./activity-store";

export default function ActivityPanel() {
  const { open, setOpen, activities } = useActivityStore();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed right-0 top-0 h-full w-80 bg-white border-l shadow-xl z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-full">
          {activities.map((item) => (
            <div key={item.id} className="p-3 rounded border bg-gray-50">
              <p className="font-medium">{item.action}</p>
              <p className="text-xs text-gray-600">{item.timestamp}</p>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
