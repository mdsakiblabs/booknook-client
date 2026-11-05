"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookCard from "@/components/books/BookCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LatestBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`);

        if (!response.ok) {
          throw new Error("Failed to load books");
        }

        const data = await response.json();
        setBooks(data.books?.slice(0, 8) || []);
      } catch (error) {
        setError("Unable to load books right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="bg-[#101211] px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />

              <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Fresh from the shelves
              </p>
            </div>

            <h2 className="font-heading text-5xl text-foreground sm:text-6xl">
              Latest <span className="text-accent italic">Arrivals.</span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              Discover the newest additions to our growing collection. Your next
              favorite story might be waiting here.
            </p>
          </div>

          <Link
            href="/books"
            className="group inline-flex items-center gap-3 font-ui text-sm font-semibold text-foreground transition-colors hover:text-accent"
          >
            EXPLORE ALL BOOKS
            <span className="text-lg transition-transform group-hover:translate-x-1">
              ↗
            </span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-[#222823]" />

                <div className="mt-4 h-4 w-3/4 rounded bg-[#222823]" />

                <div className="mt-3 h-3 w-1/2 rounded bg-[#222823]" />

                <div className="mt-4 h-16 rounded-lg bg-[#222823]" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl border border-white/10 bg-[#191D1A] px-6 py-12 text-center">
            <p className="text-sm text-muted">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-[#191D1A] px-6 py-12 text-center">
            <p className="font-heading text-2xl text-foreground">
              No books yet.
            </p>

            <p className="mt-2 text-sm text-muted">
              New arrivals will appear here.
            </p>
          </div>
        )}

        {/* Book Grid */}
        {!loading && !error && books.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Link
                href="/books"
                className="inline-flex items-center gap-3 rounded-lg border border-white/15 px-7 py-3.5 font-ui text-xs font-bold uppercase tracking-[0.15em] text-foreground transition-all hover:border-accent hover:bg-accent hover:text-[#101211]"
              >
                Discover the Collection
                <span className="text-base">↗</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestBooks;
