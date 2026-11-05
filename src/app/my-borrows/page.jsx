"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyBorrowsPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login?callbackURL=/my-borrows");
      return;
    }

    const fetchBorrows = async () => {
      try {
        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Unable to verify your session.");
        }

        const response = await fetch(`${API_URL}/borrows`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load borrowed books.");
        }

        setBorrows(result.borrows || []);
      } catch (err) {
        setError(err.message || "Unable to load borrowed books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <p className="font-ui text-sm tracking-widest text-accent">
          LOADING YOUR BORROWS...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-5 text-center">
        <h1 className="font-heading text-4xl text-foreground">
          Something went wrong.
        </h1>
        <p className="mt-3 text-sm text-muted">{error}</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-background px-5 py-16 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Your Reading Activity
          </p>

          <h1 className="mt-4 font-heading text-5xl text-foreground sm:text-6xl">
            My Borrows<span className="text-accent">.</span>
          </h1>

          <p className="mt-4 text-sm text-muted">
            Keep track of the books you've borrowed from our library.
          </p>
        </div>

        {borrows.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-20 text-center">
            <h2 className="font-heading text-3xl text-foreground">
              Your shelf is empty.
            </h2>

            <p className="mt-3 text-sm text-muted">
              You haven't borrowed any books yet.
            </p>

            <Link
              href="/books"
              className="mt-7 inline-block rounded-lg bg-accent px-6 py-3 font-ui text-sm font-bold text-[#101211] hover:bg-accent-hover"
            >
              EXPLORE BOOKS ↗
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {borrows.map((borrow) => (
              <article
                key={borrow._id}
                className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#222823]">
                  <img
                    src={borrow.bookImage || "/placeholder-book.png"}
                    alt={borrow.bookTitle}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h2 className="font-heading text-2xl text-foreground">
                    {borrow.bookTitle}
                  </h2>

                  <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-muted">Borrowed on</span>
                      <span className="text-foreground">
                        {new Date(borrow.borrowDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-muted">Return by</span>
                      <span className="font-semibold text-accent">
                        {new Date(borrow.returnDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-ui text-xs font-semibold text-accent">
                      CURRENTLY BORROWED
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
