import { registerAction } from "./actions";

export default function RegisterPage() {
  return (
    <form action={registerAction} className="space-y-4">
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Create Account</button>
    </form>
  );
}
