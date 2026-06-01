"use client";

import { create } from "zustand";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
}

interface NotificationState {
  open: boolean;
  notifications: Notification[];
  setOpen: (open: boolean) => void;
  markRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  open: false,
  notifications: [
    {
      id: "1",
      title: "New Bid Received",
      message: "A builder has placed a bid on your job.",
      read: false,
    },
    {
      id: "2",
      title: "Job Approved",
      message: "Your job listing has been approved.",
      read: false,
    },
  ],
  setOpen: (open: boolean) => set({ open }),
  markRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
}));
