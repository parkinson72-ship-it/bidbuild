"use client";

import { useState } from "react";

export default function SendMessageForm({
  jobId,
  recipientId
}: {
  jobId: string;
  recipientId: string;
}) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function uploadFile(file: File) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form
    });

    return res.json();
  }

  async function sendFile(file: File) {
    setSending(true);

    const clientId = "client-" + crypto.randomUUID();

    const tempMessage = {
      id: clientId,
      clientId,
      isOwn: true,
      sender: { id: "me", name: "You" },
      sending: true,
      fileName: file.name,
      fileType: file.type,
      fileUrl: null
    };

    window.dispatchEvent(
      new CustomEvent("temp-message", { detail: tempMessage })
    );

    const uploaded = await uploadFile(file);

    await fetch(`/api/jobs/${jobId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: null,
        recipientId,
        clientId,
        fileUrl: uploaded.url,
        fileName: uploaded.name,
        fileType: uploaded.type
      })
    });

    setSending(false);
  }

  async function sendMessage() {
    if (!content.trim()) return;

    setSending(true);

    const clientId = "client-" + crypto.randomUUID();

    const tempMessage = {
      id: clientId,
      clientId,
      content,
      createdAt: new Date().toISOString(),
      isOwn: true,
      sender: { id: "me", name: "You" },
      sending: true
    };

    window.dispatchEvent(
      new CustomEvent("temp-message", { detail: tempMessage })
    );

    await fetch(`/api/jobs/${jobId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, recipientId, clientId })
    });

    setContent("");
    setSending(false);
  }

  return (
    <div className="mt-4 flex gap-2 items-end">
      <label className="cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
        📎
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) sendFile(e.target.files[0]);
          }}
        />
      </label>

      <textarea
        className="flex-1 border rounded p-3 h-24 resize-none"
        placeholder="Type your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={sendMessage}
        disabled={sending || !content.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}
