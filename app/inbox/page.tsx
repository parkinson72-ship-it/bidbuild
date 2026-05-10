import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JobChat from "@/components/JobChat";

export default async function InboxPage() {
  const { user } = await validateRequest();
  if (!user) {
    return <div className="p-6">Not authenticated</div>;
  }

  // Find the job the user is involved in
  const job = await prisma.job.findFirst({
    where: {
      userId: user.id
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!job) {
    return <div className="p-6">No jobs found</div>;
  }

  // Determine the recipient:
  // If messages exist, the recipient is whoever is NOT the logged-in user.
  let recipientId: string | null = null;

  if (job.messages.length > 0) {
    const firstMsg = job.messages[0];
    recipientId =
      firstMsg.senderId === user.id
        ? firstMsg.recipientId
        : firstMsg.senderId;
  } else {
    // No messages yet → the only known participant is the job owner
    // So the user cannot chat with themselves.
    return (
      <div className="p-6">
        No conversation started yet. Waiting for another user to message you.
      </div>
    );
  }

  if (!recipientId) {
    return <div className="p-6">Recipient not found</div>;
  }

  return (
    <div className="p-4 h-[calc(100vh-100px)]">
      <JobChat jobId={job.id} recipientId={recipientId} />
    </div>
  );
}
