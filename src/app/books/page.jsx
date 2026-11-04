"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`);

        if (!response.ok) {
          throw new Error("Failed to load books.");
        }

        const data = await response.json();
        setBooks(data.books || []);
      } catch (err) {
        setError("Unable to load books right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const query = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.category?.toLowerCase().includes(query)
    );
  });

  return (
    <section className="min-h-screen bg-background px-5 py-20 md:px-10">
      <div className="mx-auto max-w-[1440px]">
        {/* Heading */}
        <div className="mb-12">
          <p className="mb-4 font-ui text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            The complete collection
          </p>

          <h1 className="font-heading text-5xl text-foreground sm:text-7xl">
            Explore the <span className="italic text-accent">library.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
            Discover your next favorite book from our growing collection of
            stories, knowledge, and ideas.
          </p>
        </div>

        {/* Search and Count */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-md">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author or category..."
              className="w-full rounded-lg border border-border bg-surface px-5 py-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
            />
          </div>

          <p className="font-ui text-sm text-muted">
            {filteredBooks.length} books found
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-surface-elevated" />
                <div className="mt-4 h-4 w-3/4 rounded bg-surface-elevated" />
                <div className="mt-3 h-3 w-1/2 rounded bg-surface-elevated" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
            <p className="text-sm text-muted">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredBooks.length === 0 && (
          <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
            <h2 className="font-heading text-3xl text-foreground">
              {search ? "No matching books." : "The library is empty."}
            </h2>

            <p className="mt-3 text-sm text-muted">
              {search
                ? "Try searching with another title, author or category."
                : "New books will appear here when they are added."}
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && filteredBooks.length > 0 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {filteredBooks.map((book) => (
              <article key={book._id} className="group min-w-0">
                <Link
                  href={`/books/${book._id}`}
                  className="relative block overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <img
                    src={book.image || "/placeholder-book.png"}
                    alt={book.title || "Book cover"}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-accent text-lg text-[#101211] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    ↗
                  </span>
                </Link>

                <div className="mt-4">
                  <p className="mb-2 truncate font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
                    {book.category}
                  </p>

                  <h2 className="line-clamp-2 font-ui text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                    {book.title}
                  </h2>

                  <p className="mt-2 truncate text-xs text-muted">
                    {book.author}
                  </p>

                  <p className="mt-2 text-xs text-muted">
                    {book.availableCopies ?? 0} copies available
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-4 inline-block border-b border-white/20 pb-1 font-ui text-xs font-semibold text-muted transition-colors hover:border-accent hover:text-accent"
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
}
