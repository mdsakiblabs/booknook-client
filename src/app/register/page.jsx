"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(form.password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(form.password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: registerError } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (registerError) {
        throw new Error(registerError.message);
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err.message || "Google sign up failed.");
      setGoogleLoading(false);
    }
  };

  const handleGitHubSignUp = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err.message || "GitHub sign up failed.");
      setGoogleLoading(false);
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
            Begin your journey
          </p>

          <h1 className="mt-3 font-heading text-5xl text-foreground">
            Create an account.
          </h1>

          <p className="mt-3 text-sm text-muted">
            Join our community of book lovers.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-surface p-7 sm:p-9"
        >
          <div>
            <label className="mb-2 block font-ui text-sm text-foreground">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-2 block font-ui text-sm text-foreground">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-2 block font-ui text-sm text-foreground">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-2 block font-ui text-sm text-foreground">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
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
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT ↗"}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="px-4 text-xs uppercase tracking-widest text-muted">
              Or continue with
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background py-4 font-ui text-sm font-semibold text-foreground transition-colors hover:border-accent disabled:opacity-50"
          >
            {googleLoading ? "CONNECTING TO GOOGLE..." : "SIGN UP WITH GOOGLE"}
          </button>

          <button
            type="button"
            onClick={handleGitHubSignUp}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background py-4 font-ui text-sm font-semibold text-foreground transition-colors hover:border-accent disabled:opacity-50"
          >
            {googleLoading ? "CONNECTING TO GITHUB..." : "SIGN UP WITH GITHUB"}
          </button>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-accent hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
