"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    setSuccess("Registration successful! Redirecting to login...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Register</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm text-center">{success}</p>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>

      <p className="text-sm mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 underline">
          Login
        </a>
      </p>
    </div>
  );
}
