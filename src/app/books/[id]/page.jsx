"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(`/login?callbackURL=/books/${id}`);
      return;
    }

    const fetchBook = async () => {
      try {
        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Unable to verify your session.");
        }

        const response = await fetch(`${API_URL}/books/${id}`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load book details.");
        }

        setBook(result.book);
      } catch (err) {
        setError(err.message || "Unable to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <p className="font-ui text-sm tracking-widest text-accent">
          LOADING BOOK DETAILS...
        </p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-5">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-foreground">
            Book unavailable.
          </h1>
          <p className="mt-3 text-sm text-muted">
            {error || "We couldn't find this book."}
          </p>
          <Link
            href="/books"
            className="mt-6 inline-block font-ui text-sm font-semibold text-accent hover:underline"
          >
            ← Back to library
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background px-5 py-20 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/books"
          className="mb-12 inline-block font-ui text-sm text-muted transition-colors hover:text-accent"
        >
          ← Back to library
        </Link>

        <div className="grid items-start gap-12 md:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Book Cover */}
          <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-border bg-surface">
            <img
              src={book.image || "/placeholder-book.png"}
              alt={book.title}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>

          {/* Book Information */}
          <div className="pt-2">
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {book.category}
            </p>

            <h1 className="mt-5 font-heading text-5xl leading-tight text-foreground sm:text-6xl">
              {book.title}
            </h1>

            <p className="mt-5 text-sm text-muted">
              Written by{" "}
              <span className="font-semibold text-foreground">
                {book.author}
              </span>
            </p>

            <div className="my-10 grid grid-cols-2 gap-5 border-y border-border py-7">
              <div>
                <p className="font-heading text-4xl text-foreground">
                  {book.totalCopies ?? 0}
                </p>
                <p className="mt-2 font-ui text-xs uppercase tracking-wider text-muted">
                  Total copies
                </p>
              </div>

              <div>
                <p className="font-heading text-4xl text-accent">
                  {book.availableCopies ?? 0}
                </p>
                <p className="mt-2 font-ui text-xs uppercase tracking-wider text-muted">
                  Available now
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-ui text-sm font-bold uppercase tracking-widest text-foreground">
                About this book
              </h2>

              <p className="mt-5 whitespace-pre-line text-sm leading-8 text-muted">
                {book.description || "No description available for this book."}
              </p>
            </div>

            <div className="mt-10">
              <button
                disabled={true}
                className="w-full cursor-not-allowed rounded-lg bg-accent px-7 py-4 font-ui text-sm font-bold text-[#101211] opacity-60 sm:w-auto"
              >
                BORROW BOOK — COMING NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
