"use client";

import { useState } from "react";

export default function BidForm({ jobId }: { jobId: string }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitBid(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/jobs/${jobId}/bid`, {
      method: "POST",
      body: JSON.stringify({ amount, message })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setAmount("");
    setMessage("");
    setLoading(false);

    window.location.reload();
  }

  return (
    <form onSubmit={submitBid} className="space-y-4 border p-4 rounded mt-6">
      <h2 className="text-xl font-semibold">Place a Bid</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="number"
        placeholder="Bid amount (£)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      <textarea
        placeholder="Message to the job owner"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting…" : "Submit Bid"}
      </button>
    </form>
  );
}
