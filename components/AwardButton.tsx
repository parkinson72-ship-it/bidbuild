"use client";

import { useState } from "react";

export default function AwardButton({
  jobId,
  bidId
}: {
  jobId: string;
  bidId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function awardBid() {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/jobs/${jobId}/award`, {
      method: "POST",
      body: JSON.stringify({ bidId })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    // Refresh to show awarded status
    window.location.reload();
  }

  return (
    <div className="mt-2">
      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={awardBid}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Awarding…" : "Award Job"}
      </button>
    </div>
  );
}
