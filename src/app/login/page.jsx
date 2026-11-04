"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: loginError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (loginError) {
        throw new Error(loginError.message);
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-5 py-20">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-ui text-3xl font-bold">
            BOOKNOOK<span className="text-accent">.</span>
          </Link>

          <p className="mt-8 font-ui text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Welcome back
          </p>

          <h1 className="mt-3 font-heading text-5xl text-foreground">
            Good to see you.
          </h1>

          <p className="mt-3 text-sm text-muted">
            Sign in and continue your reading journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-border bg-surface p-7 sm:p-9"
        >
          <div>
            <label className="mb-2 block font-ui text-sm text-foreground">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="font-ui text-sm text-foreground">
                Password
              </label>

              <button
                type="button"
                className="text-xs text-muted transition-colors hover:text-accent"
              >
                Forgot password?
              </button>
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-4 font-ui text-sm font-bold text-[#101211] transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "SIGNING IN..." : "LOG IN ↗"}
          </button>

          <p className="text-center text-sm text-muted">
            New to BookNook?{" "}
            <Link
              href="/register"
              className="font-semibold text-accent hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
