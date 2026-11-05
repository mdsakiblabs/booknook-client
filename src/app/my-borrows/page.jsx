"use client";
import BookCard from "@/components/books/BookCard";
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
  const [returningId, setReturningId] = useState(null);

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

  const handleReturn = async (borrowId) => {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?",
    );

    if (!confirmed) return;

    try {
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Unable to verify your session.");
      }

      const response = await fetch(`${API_URL}/borrows/${borrowId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to return book.");
      }

      setBorrows((prev) => prev.filter((borrow) => borrow._id !== borrowId));

      alert("Book returned successfully!");
    } catch (err) {
      alert(err.message || "Something went wrong.");
    }
  };

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

  const getBorrowStatus = (returnDate) => {
    if (!returnDate) {
      return {
        label: "UNKNOWN",
        color: "text-[#A7ADA5]",
        background: "bg-white/[0.05]",
        border: "border-white/10",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(returnDate);
    deadline.setHours(0, 0, 0, 0);

    if (today > deadline) {
      return {
        label: "OVERDUE",
        color: "text-red-400",
        background: "bg-red-400/[0.07]",
        border: "border-red-400/25",
      };
    }

    return {
      label: "ON TIME",
      color: "text-[#D5FF3F]",
      background: "bg-[#D5FF3F]/[0.07]",
      border: "border-[#D5FF3F]/25",
    };
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {borrows.map((borrow) => {
              const status = getBorrowStatus(borrow.returnDate);
              const isReturning = returningId === borrow._id;

              const book = {
                _id: borrow.bookId,
                title: borrow.bookTitle,
                author: borrow.bookAuthor || "Unknown Author",
                image: borrow.bookImage,
                category: borrow.bookCategory || "Borrowed Book",
                subtitle: "",
                description: "",
                publisher: "",
                publishedYear: "",
                pages: "",
                language: "",
                format: "",
                tags: [],
                featured: false,
                availableCopies: 0,
                totalCopies: 0,
              };

              return (
                <div key={borrow._id} className="min-w-0">
                  <BookCard book={book} />

                  <div className="mt-3 rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-ui text-[10px] uppercase tracking-wider text-muted">
                        Return Deadline
                      </span>

                      <span className="text-xs font-semibold text-foreground">
                        {formatDate(borrow.returnDate)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="font-ui text-[10px] uppercase tracking-wider text-muted">
                        Borrow Status
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-bold ${status.color} ${status.background} ${status.border}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-border pt-4">
                      <button
                        type="button"
                        onClick={() => handleReturn(borrow._id)}
                        disabled={Boolean(returningId)}
                        className="w-full rounded-lg border border-red-400/25 bg-red-400/[0.04] px-5 py-3 font-ui text-xs font-bold tracking-wide text-red-400 transition-colors hover:border-red-400/50 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isReturning ? "RETURNING..." : "RETURN BOOK ↗"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
