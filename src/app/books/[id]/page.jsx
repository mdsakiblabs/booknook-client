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
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [isBorrowing, setIsBorrowing] = useState(false);

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

  const handleBorrow = async () => {
    if (!returnDate) {
      alert("Please select a return date.");
      return;
    }

    if (book.availableCopies <= 0) {
      alert("This book is currently unavailable.");
      return;
    }

    setIsBorrowing(true);

    try {
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Unable to verify your session.");
      }

      const response = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
          returnDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to borrow book.");
      }

      setBook((prev) => ({
        ...prev,
        availableCopies: Math.max(0, prev.availableCopies - 1),
      }));

      setShowBorrowModal(false);
      setReturnDate("");

      alert("Book borrowed successfully!");
    } catch (err) {
      alert(err.message || "Something went wrong.");
    } finally {
      setIsBorrowing(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#101211]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#D5FF3F]" />
          <p className="font-ui text-xs font-semibold tracking-[0.14em] text-[#D5FF3F]">
            OPENING THE ARCHIVE
          </p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#101211] px-5">
        <div className="max-w-md text-center">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.14em] text-[#D5FF3F]">
            BookNook Archive
          </p>

          <h1 className="mt-4 font-heading text-4xl text-[#F0EEE8]">
            Book unavailable<span className="text-[#D5FF3F]">.</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#A7ADA5]">
            {error || "We couldn't find this book in our collection."}
          </p>

          <Link
            href="/books"
            className="mt-6 inline-flex rounded-lg bg-[#D5FF3F] px-5 py-3 font-ui text-xs font-bold uppercase tracking-wider text-[#101211] hover:bg-[#C1EA2F]"
          >
            Back to library ↗
          </Link>
        </div>
      </section>
    );
  }

  const available = Math.max(0, Number(book.availableCopies) || 0);
  const total = Math.max(0, Number(book.totalCopies) || 0);

  const availabilityPercentage =
    total > 0 ? Math.min(100, (available / total) * 100) : 0;

  const specifications = [
    { label: "ISBN", value: book.isbn },
    { label: "Publisher", value: book.publisher },
    { label: "Published", value: book.publishedYear },
    { label: "Pages", value: book.pages ? `${book.pages} pages` : "" },
    { label: "Language", value: book.language },
    { label: "Format", value: book.format },
  ].filter((item) => item.value);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const minReturnDate = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <main className="min-h-screen overflow-hidden bg-[#101211] text-[#F0EEE8]">
      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-[1200px] items-center gap-2 overflow-hidden px-5 py-4 text-xs md:px-8">
          <Link
            href="/"
            className="shrink-0 text-[#A7ADA5] transition-colors hover:text-[#D5FF3F]"
          >
            Home
          </Link>
          <span className="text-white/20">/</span>
          <Link
            href="/books"
            className="shrink-0 text-[#A7ADA5] transition-colors hover:text-[#D5FF3F]"
          >
            All Books
          </Link>
          <span className="text-white/20">/</span>
          <span className="truncate text-[#D5FF3F]">{book.title}</span>
        </div>
      </div>

      {/* Main Book Showcase */}
      <section className="relative">
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#D5FF3F]/[0.035] blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1200px] items-start gap-9 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[350px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[370px_minmax(0,1fr)] xl:gap-16">
          {/* Cover */}
          <div className="mx-auto w-full max-w-[340px] lg:sticky lg:top-8 lg:max-w-none">
            <div className="rounded-2xl border border-white/[0.09] bg-[#191D1A] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="relative overflow-hidden rounded-xl bg-[#222823]">
                <img
                  src={book.image || "/placeholder-book.png"}
                  alt={book.title}
                  className="aspect-[3/4] w-full object-cover"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                {book.featured && (
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[#D5FF3F]/30 bg-[#101211]/85 px-3 py-2 backdrop-blur-md">
                    <span className="text-sm text-[#D5FF3F]">★</span>
                    <span className="font-ui text-[10px] font-bold uppercase tracking-wider text-[#F0EEE8]">
                      Featured Edition
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-1 pb-1 pt-4">
                <div>
                  <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A7ADA5]">
                    Collection
                  </p>
                  <p className="mt-1 font-heading text-xl text-[#D5FF3F]">
                    BookNook
                  </p>
                </div>

                <p className="font-ui text-[10px] font-medium uppercase tracking-wider text-[#A7ADA5]/60">
                  The art of reading
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#A7ADA5]/70">
              <span className="h-px w-7 bg-white/15" />
              A part of your reading journey
              <span className="h-px w-7 bg-white/15" />
            </div>
          </div>

          {/* Book Information */}
          <div className="min-w-0 lg:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#D5FF3F]/25 bg-[#D5FF3F]/[0.07] px-3 py-1.5 font-ui text-[10px] font-bold uppercase tracking-wider text-[#D5FF3F]">
                {book.category || "Uncategorized"}
              </span>

              {book.featured && (
                <span className="rounded-md border border-[#D68C61]/25 bg-[#D68C61]/[0.07] px-3 py-1.5 font-ui text-[10px] font-semibold uppercase tracking-wider text-[#D68C61]">
                  ★ Editor's selection
                </span>
              )}
            </div>

            <p className="mt-6 font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A7ADA5]">
              A story waiting to be discovered
            </p>

            <h1 className="mt-3 max-w-2xl break-words font-heading text-[42px] leading-[1.08] text-[#F0EEE8] sm:text-[50px] lg:text-[54px]">
              {book.title}
              <span className="text-[#D5FF3F]">.</span>
            </h1>

            {book.subtitle && (
              <p className="mt-3 max-w-xl font-heading text-xl leading-snug text-[#A7ADA5] sm:text-2xl">
                {book.subtitle}
              </p>
            )}

            {/* Author */}
            <div className="mt-6 flex items-center gap-3 border-b border-white/[0.08] pb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D5FF3F]/20 bg-[#D5FF3F]/[0.07] font-heading text-xl text-[#D5FF3F]">
                {book.author?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div>
                <p className="text-xs text-[#A7ADA5]">Written by</p>
                <p className="mt-0.5 text-sm font-semibold text-[#F0EEE8]">
                  {book.author || "Unknown Author"}
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#191D1A] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#A7ADA5]">
                    Library availability
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-[38px] leading-none text-[#D5FF3F]">
                      {available.toString().padStart(2, "0")}
                    </span>
                    <span className="text-sm text-[#A7ADA5]">
                      of {total.toString().padStart(2, "0")} copies available
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 ${
                    available > 0
                      ? "border-[#D5FF3F]/20 bg-[#D5FF3F]/[0.07] text-[#D5FF3F]"
                      : "border-[#D68C61]/25 bg-[#D68C61]/[0.07] text-[#D68C61]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="font-ui text-[10px] font-bold uppercase tracking-wider">
                    {available > 0 ? "Available now" : "Fully borrowed"}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-[11px] text-[#A7ADA5]">
                  <span>Stock availability</span>
                  <span>{Math.round(availabilityPercentage)}%</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-[#D5FF3F] transition-all duration-500"
                    style={{ width: `${availabilityPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowBorrowModal(true)}
                disabled={available <= 0}
                className="group flex items-center justify-center gap-3 rounded-lg bg-[#D5FF3F] px-6 py-3.5 font-ui text-xs font-bold uppercase tracking-wider text-[#101211] transition-all hover:-translate-y-0.5 hover:bg-[#C1EA2F] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:min-w-[190px]"
              >
                {available > 0 ? "Borrow this book" : "Currently unavailable"}
                {available > 0 && (
                  <span className="text-base transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                )}
              </button>

              <Link
                href="/books"
                className="flex items-center justify-center rounded-lg border border-white/10 px-6 py-3.5 font-ui text-xs font-semibold uppercase tracking-wider text-[#A7ADA5] transition-colors hover:border-[#D5FF3F]/40 hover:text-[#F0EEE8]"
              >
                Explore library
              </Link>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#A7ADA5]/75">
              Borrow your next favourite read and discover something new.
            </p>
          </div>
        </div>
      </section>

     

      {/* Description & Tags */}
      <section className="border-y border-white/[0.07] bg-[#191D1A]">
        <div className="mx-auto grid max-w-[1200px] items-start gap-8 px-5 py-10 md:px-8 md:py-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          {/* Story */}
          <div className="min-w-0">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.16em] text-[#D5FF3F]">
              01 / The story
            </p>

            <h2 className="mt-3 font-heading text-[34px] leading-tight text-[#F0EEE8]">
              Inside the pages<span className="text-[#D5FF3F]">.</span>
            </h2>

            <div className="mt-4 h-0.5 w-10 bg-[#D5FF3F]" />

            <p className="mt-6 whitespace-pre-line text-[14px] leading-[1.85] text-[#C5C9C1] sm:text-[15px]">
              {book.description ||
                "No description is available for this book yet. Explore its details and discover what awaits inside."}
            </p>
          </div>

          {/* Themes Box */}
          {Array.isArray(book.tags) && book.tags.length > 0 && (
            <div className="rounded-xl border border-white/[0.09] bg-[#222823] p-5 sm:p-6 lg:mt-8">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#D5FF3F]">
                Explore the themes
              </p>

              <div className="mb-5 mt-4 h-px bg-white/[0.08]" />

              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-md border border-white/10 bg-[#191D1A] px-3 py-2 text-xs text-[#D0D2CC] transition-colors hover:border-[#D5FF3F]/40 hover:text-[#D5FF3F]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Specifications */}
      <section className="mx-auto max-w-[1200px] px-5 py-11 md:px-8 md:py-14">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.16em] text-[#D5FF3F]">
              02 / The details
            </p>

            <h2 className="mt-2 font-heading text-[36px] leading-tight text-[#F0EEE8]">
              At a glance<span className="text-[#D5FF3F]">.</span>
            </h2>
          </div>

          <p className="max-w-xs text-xs leading-5 text-[#A7ADA5]">
            Everything you need to know about this edition.
          </p>
        </div>

        {specifications.length > 0 ? (
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
            {specifications.map((item) => (
              <div
                key={item.label}
                className="group min-w-0 bg-[#191D1A] p-5 transition-colors hover:bg-[#222823] sm:p-6"
              >
                <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A7ADA5]">
                  {item.label}
                </p>

                <p className="mt-2 break-words font-heading text-[23px] leading-snug text-[#F0EEE8] transition-colors group-hover:text-[#D5FF3F]">
                  {item.value}
                </p>

                <div className="mt-3 h-px w-7 bg-[#D5FF3F]/40 transition-all group-hover:w-11 group-hover:bg-[#D5FF3F]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#191D1A] p-6 text-sm text-[#A7ADA5]">
            Additional publication details are not available.
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="px-5 pb-12 md:px-8 md:pb-16">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-2xl border border-[#D5FF3F]/20 bg-[#191D1A] px-6 py-8 sm:px-9 sm:py-9 lg:px-11">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#D5FF3F]/[0.06] blur-[75px]" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.16em] text-[#D5FF3F]">
                Your next chapter starts here
              </p>

              <h2 className="mt-2 font-heading text-[32px] leading-tight text-[#F0EEE8] sm:text-[38px]">
                Great stories deserve to be{" "}
                <span className="italic text-[#D5FF3F]">shared.</span>
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-[#A7ADA5]">
                Discover more titles in the BookNook collection and find the
                story you have been looking for.
              </p>
            </div>

            <Link
              href="/books"
              className="inline-flex w-fit shrink-0 items-center gap-3 rounded-lg bg-[#D5FF3F] px-6 py-3.5 font-ui text-xs font-bold uppercase tracking-wider text-[#101211] transition-all hover:-translate-y-0.5 hover:bg-[#C1EA2F]"
            >
              Explore all books <span className="text-base">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Borrow Modal */}
      {showBorrowModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isBorrowing) {
              setShowBorrowModal(false);
            }
          }}
        >
          <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#191D1A] shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
            <div className="border-b border-white/[0.08] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.16em] text-[#D5FF3F]">
                    BookNook Library
                  </p>

                  <h2 className="mt-2 font-heading text-[30px] leading-tight text-[#F0EEE8]">
                    Make it yours<span className="text-[#D5FF3F]">.</span>
                  </h2>

                  <p className="mt-1.5 text-xs text-[#A7ADA5]">
                    Complete your borrowing request.
                  </p>
                </div>

                <button
                  onClick={() => setShowBorrowModal(false)}
                  disabled={isBorrowing}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#A7ADA5] transition-colors hover:border-[#D5FF3F]/40 hover:text-[#D5FF3F] disabled:opacity-40"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#222823] p-3">
                <img
                  src={book.image || "/placeholder-book.png"}
                  alt={book.title}
                  className="h-[68px] w-12 rounded-md object-cover"
                />

                <div className="min-w-0">
                  <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A7ADA5]">
                    Selected book
                  </p>

                  <p className="mt-1.5 line-clamp-2 font-heading text-lg leading-tight text-[#F0EEE8]">
                    {book.title}
                  </p>

                  <p className="mt-1 text-xs text-[#A7ADA5]">{book.author}</p>
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="returnDate"
                  className="mb-2 block font-ui text-[10px] font-bold uppercase tracking-[0.13em] text-[#A7ADA5]"
                >
                  Choose your return date
                </label>

                <input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  min={minReturnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#101211] px-3.5 py-3 text-sm text-[#F0EEE8] outline-none transition-colors focus:border-[#D5FF3F]"
                />

                <p className="mt-2 text-[11px] leading-5 text-[#A7ADA5]/70">
                  Select a date at least one day from today.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowBorrowModal(false)}
                  disabled={isBorrowing}
                  className="rounded-lg border border-white/10 px-4 py-3 font-ui text-[10px] font-bold uppercase tracking-wider text-[#A7ADA5] transition-colors hover:border-white/30 hover:text-[#F0EEE8] disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  onClick={handleBorrow}
                  disabled={isBorrowing || !returnDate}
                  className="rounded-lg bg-[#D5FF3F] px-4 py-3 font-ui text-[10px] font-bold uppercase tracking-wider text-[#101211] transition-colors hover:bg-[#C1EA2F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isBorrowing ? "Processing..." : "Confirm borrow ↗"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
