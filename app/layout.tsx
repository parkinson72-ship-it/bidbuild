import "./globals.css";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Sidebar from "../components/Sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body style={{ display: "flex" }}>
        <Sidebar user={user} />
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}


