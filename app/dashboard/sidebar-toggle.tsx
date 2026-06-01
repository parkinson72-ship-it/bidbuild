"use client";

import { useSidebarStore } from "./sidebar-store";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function MobileToggle() {
  const { setMobileOpen } = useSidebarStore();

  return (
    <button
      onClick={() => setMobileOpen(true)}
      className="md:hidden bg-gray-100 p-2 rounded border shadow"
    >
      <Bars3Icon className="w-6 h-6" />
    </button>
  );
}
