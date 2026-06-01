"use client";

import { create } from "zustand";

interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
}

interface ActivityState {
  open: boolean;
  activities: ActivityItem[];
  setOpen: (open: boolean) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  open: false,
  activities: [
    {
      id: "1",
      action: "You posted a new job",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      action: "A builder placed a bid",
      timestamp: "5 hours ago",
    },
    {
      id: "3",
      action: "You updated your profile",
      timestamp: "Yesterday",
    },
  ],
  setOpen: (open: boolean) => set({ open }),
}));
