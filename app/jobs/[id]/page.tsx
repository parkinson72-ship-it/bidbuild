import { prisma } from "@/lib/prisma";
import BidList from "@/components/BidList";
import BidForm from "@/components/BidForm";
import MarkMessagesRead from "@/components/MarkMessagesRead";
import JobChat from "@/components/JobChat";
import { validateRequest } from "@/lib/auth";

export default async function JobPage({ params }: { params: { id: string } }) {
  const { user } = await validateRequest();

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      awardedBid: {
        include: {
          user: true
        }
      }
    }
  });

  if (!job) {
    return <div>Job not found</div>;
  }

  const isOwner = user?.id === job.userId;
  const isAwardedContractor = user?.id === job.awardedBid?.userId;

  return (
    <div className="p-6 space-y-10">
      {(isOwner || isAwardedContractor) && (
        <MarkMessagesRead jobId={params.id} />
      )}

      <div>
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-gray-700 mb-4">{job.description}</p>

        <p className="text-sm text-gray-500">
          Posted by: {job.user.name || job.user.email}
        </p>

        {job.status === "AWARDED" && job.awardedBid && (
          <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
            <p className="font-semibold text-green-800">
              ✔ Job Awarded to{" "}
              {job.awardedBid.user.name || job.awardedBid.user.email}
            </p>
            <p className="text-green-700 mt-1">
              Winning Bid: £{job.awardedBid.amount}
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Bids</h2>
        <BidList jobId={params.id} />
      </div>

      {job.status !== "AWARDED" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Place a Bid</h2>
          <BidForm jobId={params.id} />
        </div>
      )}

      {(isOwner || isAwardedContractor) && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Messages</h2>

          <JobChat
            jobId={params.id}
            recipientId={
              isOwner ? job.awardedBid?.userId || "" : job.userId
            }
          />
        </div>
      )}
    </div>
  );
}
