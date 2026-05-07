"use client";

import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Invalid credentials");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />

      <button type="submit">Login</button>
    </form>
  );
}
