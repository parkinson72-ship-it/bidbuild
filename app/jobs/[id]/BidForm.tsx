"use client";

import { useState } from "react";

export default function BidForm({ jobId }: { jobId: string }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitBid(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch(`/api/jobs/${jobId}/bid`, {
      method: "POST",
      body: JSON.stringify({ amount, message }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    setAmount("");
    setMessage("");
    setLoading(false);

    // Refresh page to show new bid
    window.location.reload();
  }

  return (
    <form onSubmit={submitBid} className="space-y-4 border p-4 rounded mt-8">
      <h2 className="text-xl font-semibold">Place a Bid</h2>

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
        {loading ? "Submitting..." : "Submit Bid"}
      </button>
    </form>
  );
}
