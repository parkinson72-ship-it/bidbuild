"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BidForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/jobs/${jobId}/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        message,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setAmount("");
      setMessage("");
      router.refresh();
    } else {
      alert("Failed to submit bid");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        marginTop: "2rem",
        padding: "1rem",
        background: "#f5f5f5",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
    >
      <h2 style={{ margin: 0 }}>Place a Bid</h2>

      <input
        type="number"
        placeholder="Bid amount (£)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{
          padding: "0.75rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <textarea
        placeholder="Message to homeowner"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={3}
        style={{
          padding: "0.75rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.75rem",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Submitting..." : "Submit Bid"}
      </button>
    </form>
  );
}
