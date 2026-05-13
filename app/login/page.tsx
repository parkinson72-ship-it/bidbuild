// app/login/page.tsx
export default function LoginPage() {
  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>Login</h1>
      <form method="post" action="/api/auth/callback/credentials">
        <div style={{ marginBottom: "0.75rem" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "0.25rem" }}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "0.25rem" }}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </form>
    </main>
  );
}

