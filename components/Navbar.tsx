import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="navbar">
      <Link href="/">Home</Link>

      {user ? (
        <>
          <span>Welcome, {user.name ?? user.email}</span>
          <Link href="/dashboard">Dashboard</Link>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
