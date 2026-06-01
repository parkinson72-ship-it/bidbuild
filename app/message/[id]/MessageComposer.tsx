"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MessageComposer({ conversationId }: { conversationId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendMessage = async () => {
    if (!content.trim()) return;

    setLoading(true);

    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        content,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to send message");
      return;
    }

    setContent("");       // Clear input
    router.refresh();     // Refresh message list
  };

  return (
    <div className="border-t p-4 flex gap-2 items-center bg-white">
      <textarea
        className="flex-1 border rounded p-2 text-sm resize-none h-20"
        placeholder="Write a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={sendMessage}
        disabled={loading || !content.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}
