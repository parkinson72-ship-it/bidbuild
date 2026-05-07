"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <button onClick={handleLogout} style={{ marginTop: "20px" }}>
      Logout
    </button>
  );
}
