"use client";

export default function TypingIndicator({ isTyping }: { isTyping: boolean }) {
  if (!isTyping) return null;

  return (
    <div className="text-sm text-gray-500 italic">
      The other user is typing…
    </div>
  );
}
