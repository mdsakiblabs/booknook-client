"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

        setBooks(data.books?.slice(0, 6) || []);
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
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-[#222823]" />
                <div className="mt-4 h-4 w-3/4 rounded bg-[#222823]" />
                <div className="mt-3 h-3 w-1/2 rounded bg-[#222823]" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl border border-white/10 bg-[#191d1a] px-6 py-12 text-center">
            <p className="text-sm text-muted">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-[#191d1a] px-6 py-12 text-center">
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
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
            {books.map((book) => (
              <article key={book._id} className="group min-w-0">
                <Link
                  href={`/books/${book._id}`}
                  className="relative block overflow-hidden rounded-xl border border-white/10 bg-[#191d1a]"
                >
                  <img
                    src={book.image || "/placeholder-book.png"}
                    alt={book.title}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-accent text-lg text-[#101211] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    ↗
                  </span>
                </Link>

                <div className="mt-4">
                  <p className="mb-2 font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
                    {book.category}
                  </p>

                  <h3 className="line-clamp-2 font-ui text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                    {book.title}
                  </h3>

                  <p className="mt-2 truncate text-xs text-muted">
                    {book.author}
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-4 inline-block border-b border-white/20 pb-1 font-ui text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBooks;
