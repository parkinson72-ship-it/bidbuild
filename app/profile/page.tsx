// app/profile/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: (user as { id: string }).id },
    select: { image: true },
  });

  return (
    <main>
      <h1>Profile</h1>
      <ProfilePhotoUpload currentImage={dbUser?.image} />
    </main>
  );
}
