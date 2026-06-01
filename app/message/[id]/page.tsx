import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import MessagesList from "./MessageList";
import MessageComposer from "./MessageComposer";

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: {
      job: true,
      messages: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    return <div className="p-6">Conversation not found.</div>;
  }

  // Authorisation: user must be job owner OR have sent a message
  const jobOwnerId = conversation.job.userId;
  const participantIds = [
    jobOwnerId,
    ...conversation.messages.map((m) => m.userId),
  ];

  if (!participantIds.includes(user.id)) {
    return (
      <div className="p-6 text-red-600">
        You do not have permission to view this conversation.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <h1 className="text-xl font-semibold">
          Conversation about: {conversation.job.title}
        </h1>
      </div>

      {/* REAL-TIME MESSAGE LIST */}
      <MessagesList
        initialMessages={conversation.messages}
        conversationId={conversation.id}
        currentUserId={user.id}
      />

      {/* Composer */}
      <MessageComposer conversationId={conversation.id} />
    </div>
  );
}
