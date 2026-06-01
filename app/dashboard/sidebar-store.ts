"use client";

import { create } from "zustand";

interface SidebarState {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  mobileOpen: false,
  setMobileOpen: (open: boolean) => set({ mobileOpen: open }),
}));
