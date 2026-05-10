"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ jobId }: { jobId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load initial messages
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/jobs/${jobId}/messages`);
      const data = await res.json();
      setMessages(data);
    }
    load();
  }, [jobId]);

  // Listen for optimistic temp messages
  useEffect(() => {
    function handleTemp(e: any) {
      setMessages((prev) => [...prev, e.detail]);
    }
    window.addEventListener("temp-message", handleTemp);
    return () => window.removeEventListener("temp-message", handleTemp);
  }, []);

  // SSE real‑time updates
  useEffect(() => {
    const ev = new EventSource(`/api/jobs/${jobId}/messages/stream`);

    ev.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      setMessages((prev) => {
        // Replace optimistic message if clientId matches
        if (msg.clientId) {
          const idx = prev.findIndex((m) => m.clientId === msg.clientId);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = msg;
            return updated;
          }
        }
        return [...prev, msg];
      });
    };

    return () => ev.close();
  }, [jobId]);

  // Auto‑scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded h-[500px] overflow-y-auto bg-white">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
