"use client";

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";

interface MessageUser {
  id: string;
  email: string | null;
  name?: string | null;
  image?: string | null;
}

interface Message {
  id: string;
  content: string;
  createdAt: string | Date;
  conversationId: string;
  userId: string;
  user: MessageUser;
}

export default function MessagesList({
  initialMessages,
  conversationId,
  currentUserId,
}: {
  initialMessages: Message[];
  conversationId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    const channel = pusher.subscribe(`conversation-${conversationId}`);

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
      setTimeout(scrollToBottom, 50);
    });

    return () => {
      pusher.unsubscribe(`conversation-${conversationId}`);
      pusher.disconnect();
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No messages yet. Start the conversation!
        </p>
      )}

      {messages.map((msg) => {
        const isMe = msg.userId === currentUserId;

        return (
          <div
            key={msg.id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg text-sm ${
                isMe ? "bg-blue-600 text-white" : "bg-white border"
              }`}
            >
              <p>{msg.content}</p>
              <span className="block text-[10px] opacity-70 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
