"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        padding: "8px 14px",
        background: "black",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}

