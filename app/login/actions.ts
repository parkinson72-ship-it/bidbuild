"use server";

import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res = await fetch("http://localhost:3007/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      csrfToken: "",
      email,
      password,
    }),
  });

  if (res.ok) {
    redirect("/dashboard");
  }

  return { error: "Invalid email or password" };
}
