import Link from "next/link";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function InboxPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return <div className="p-6">Not authenticated.</div>;
  }

  // Fetch all conversations where the user is involved
  const conversations = await prisma.conversation.findMany({
    include: {
      job: true,
      messages: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 1, // latest message only
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Filter: user must be job owner OR have sent a message
  const filtered = conversations.filter((c) => {
    const jobOwner = c.job.userId === user.id;
    const hasMessaged = c.messages.some((m) => m.userId === user.id);
    return jobOwner || hasMessaged;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>

      {!filtered.length && (
        <p className="text-gray-600">You have no conversations yet.</p>
      )}

      <div className="space-y-4">
        {filtered.map((conv) => {
          const latest = conv.messages[0];
          const job = conv.job;

          // Determine "other user"
          let otherUser = "Unknown";

          if (latest) {
            otherUser =
              latest.userId === user.id
                ? job.userId === user.id
                  ? "Unknown"
                  : "Job Owner"
                : latest.user.name || latest.user.email;
          }

          return (
            <Link
              key={conv.id}
              href={`/messages/${conv.id}`}
              className="block border rounded p-4 bg-white shadow hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{job.title}</h2>

                <p className="text-sm text-gray-500">
                  {latest
                    ? new Date(latest.createdAt).toLocaleString()
                    : "No messages yet"}
                </p>
              </div>

              <p className="text-gray-700 mt-1">With: {otherUser}</p>

              {latest ? (
                <p className="text-gray-600 mt-2 line-clamp-1">
                  {latest.user.name || latest.user.email}: {latest.content}
                </p>
              ) : (
                <p className="text-gray-400 mt-2">No messages yet.</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
