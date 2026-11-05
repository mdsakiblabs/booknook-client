"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const initialForm = {
  title: "",
  author: "",
  category: "",
  image: "",
  description: "",
  totalCopies: "",
};

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login?callbackURL=/add-book");
    }
  }, [session, isPending, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Please log in before adding a book.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          ...form,
          totalCopies: Number(form.totalCopies),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add book.");
      }

      setMessage("Book added successfully!");
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session?.user) {
    return null;
  }
  return (
    <section className="min-h-screen bg-background px-5 py-20 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <p className="mb-4 font-ui text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Expand the collection
          </p>

          <h1 className="font-heading text-5xl text-foreground sm:text-6xl">
            Add a new <span className="italic text-accent">book.</span>
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted">
            Bring another story to BookNook. Fill in the book details below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-border bg-surface p-6 sm:p-10"
        >
          <div>
            <label className="mb-2 block font-ui text-sm text-foreground">
              Book Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter the book title"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-2 block font-ui text-sm text-foreground">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              required
              placeholder="Enter author's name"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-ui text-sm text-foreground">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
              >
                <option value="">Select category</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
                <option value="Technology">Technology</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-ui text-sm text-foreground">
                Total Copies *
              </label>
              <input
                type="number"
                name="totalCopies"
                value={form.totalCopies}
                onChange={handleChange}
                required
                min="1"
                step="1"
                placeholder="e.g. 5"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/60 focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-ui text-sm text-foreground">
              Book Cover Image URL
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-2 block font-ui text-sm text-foreground">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Write a short description about the book..."
              className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg border border-accent/20 bg-accent/10 p-4 text-sm text-accent">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-6 py-4 font-ui text-sm font-bold text-[#101211] transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "ADDING BOOK..." : "ADD BOOK TO LIBRARY ↗"}
          </button>
        </form>
      </div>
    </section>
  );
}
