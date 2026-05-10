"use client";

import { useState } from "react";
import MessageList from "./MessageList";
import SendMessageForm from "./SendMessageForm";
import TypingIndicator from "./TypingIndicator";

export default function JobChat({
  jobId,
  recipientId
}: {
  jobId: string;
  recipientId: string;
}) {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="flex flex-col h-full border rounded bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList jobId={jobId} />
      </div>

      {/* Typing indicator */}
      <div className="px-4 py-1">
        <TypingIndicator isTyping={isTyping} />
      </div>

      {/* Send message form */}
      <div className="border-t p-4">
        <SendMessageForm
          jobId={jobId}
          recipientId={recipientId}
        />
      </div>
    </div>
  );
}
