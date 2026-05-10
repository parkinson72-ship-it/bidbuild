import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function GET() {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Find all jobs where the user is involved
  const jobs = await prisma.job.findMany({
    where: {
      OR: [
        { userId: user.id },
        { awardedBid: { userId: user.id } }
      ]
    },
    include: {
      user: true,
      awardedBid: {
        include: { user: true }
      },
      messages: {
        include: { sender: true, recipient: true },
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  const inbox = await Promise.all(
    jobs.map(async (job) => {
      const latestMessage = job.messages[0] || null;

      // Determine the other participant
      const otherUser =
        user.id === job.userId
          ? job.awardedBid?.user || null
          : job.user;

      // Count unread messages for this job
      const unreadCount = await prisma.message.count({
        where: {
          jobId: job.id,
          recipientId: user.id,
          readAt: null
        }
      });

      return {
        jobId: job.id,
        jobTitle: job.title,
        otherUser: otherUser
          ? {
              id: otherUser.id,
              name: otherUser.name,
              email: otherUser.email
            }
          : null,
        latestMessage: latestMessage
          ? {
              id: latestMessage.id,
              content: latestMessage.content,
              createdAt: latestMessage.createdAt,
              sender: {
                id: latestMessage.sender.id,
                name: latestMessage.sender.name,
                email: latestMessage.sender.email
              }
            }
          : null,
        unreadCount
      };
    })
  );

  return NextResponse.json(inbox);
}
