import AwardButton from "@/components/AwardButton";
import { prisma } from "@/lib/prisma";

type BidWithUser = {
  id: string;
  amount: number;
  message: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

export default async function BidList({ jobId }: { jobId: string }) {
  const bids = (await prisma.bid.findMany({
    where: { jobId },
    include: {
      user: true
    },
    orderBy: { amount: "asc" }
  })) as BidWithUser[];

  const job = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (!bids.length) {
    return <p>No bids yet.</p>;
  }

  return (
    <div className="space-y-4">
      {bids.map((bid: BidWithUser) => (
        <div
          key={bid.id}
          className="border p-4 rounded flex flex-col gap-2 bg-gray-50"
        >
          <p className="text-lg font-semibold">£{bid.amount}</p>
          <p className="text-gray-700">{bid.message}</p>

          <p className="text-sm text-gray-500">
            By: {bid.user.name || bid.user.email}
          </p>

          {job?.awardedBidId === bid.id && (
            <p className="text-green-700 font-bold">✔ Awarded</p>
          )}

          {job?.awardedBidId !== bid.id && (
            <AwardButton jobId={jobId} bidId={bid.id} />
          )}
        </div>
      ))}
    </div>
  );
}
