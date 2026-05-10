"use client";

export default function MessageBubble({ msg }: { msg: any }) {
  const isOwn = msg.isOwn;

  const bubbleClasses = isOwn
    ? "bg-blue-100 self-end"
    : "bg-gray-100 self-start";

  const isImage = msg.fileType?.startsWith("image/");

  return (
    <div className={`p-3 rounded max-w-[75%] ${bubbleClasses}`}>
      {/* Text content */}
      {msg.content && <div>{msg.content}</div>}

      {/* File attachments */}
      {msg.fileUrl && (
        <div className="mt-2">
          {isImage ? (
            <img
              src={msg.fileUrl}
              alt={msg.fileName}
              className="max-w-xs rounded border"
            />
          ) : (
            <a
              href={msg.fileUrl}
              target="_blank"
              className="text-blue-600 underline"
            >
              {msg.fileName}
            </a>
          )}
        </div>
      )}

      {/* Sending indicator */}
      {msg.sending && (
        <div className="text-xs text-gray-500 mt-1">sending…</div>
      )}
    </div>
  );
}
