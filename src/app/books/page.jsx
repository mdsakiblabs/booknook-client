"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BookCard from "@/components/books/BookCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const quickFilters = [
  { label: "All Books", value: "all" },
  { label: "Featured", value: "featured" },
  { label: "Available Now", value: "available" },
];

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");
  const [quickFilter, setQuickFilter] = useState("all");
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

  // Unique Categories
  const categories = useMemo(() => {
    return [
      "All Categories",
      ...new Set(
        books
          .map((book) => book.category)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)),
      ),
    ];
  }, [books]);

  // Library Statistics
  const stats = useMemo(() => {
    return {
      totalBooks: books.length,
      totalCategories: categories.length - 1,
      availableCopies: books.reduce(
        (total, book) => total + (Number(book.availableCopies) || 0),
        0,
      ),
      featuredBooks: books.filter((book) => book.featured).length,
    };
  }, [books, categories]);

  // Search, Filter and Sort
  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = books.filter((book) => {
      const searchableText = [
        book.title,
        book.subtitle,
        book.author,
        book.category,
        book.publisher,
        book.isbn,
        book.language,
        book.format,
        ...(Array.isArray(book.tags) ? book.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(query);

      const matchesCategory =
        category === "All Categories" || book.category === category;

      const matchesQuickFilter =
        quickFilter === "all" ||
        (quickFilter === "featured" && book.featured) ||
        (quickFilter === "available" && book.availableCopies > 0);

      return matchesSearch && matchesCategory && matchesQuickFilter;
    });

    result = [...result];

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    }

    if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    if (sortBy === "year") {
      result.sort(
        (a, b) =>
          (Number(b.publishedYear) || 0) - (Number(a.publishedYear) || 0),
      );
    }

    return result;
  }, [books, search, category, quickFilter, sortBy]);

  return (
    <main className="min-h-screen bg-[#101211]">
      {/* Page Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.07] px-5 pb-16 pt-20 md:px-10 md:pb-20 md:pt-28">
        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#D5FF3F]/[0.045] blur-[100px]" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9 bg-accent" />

            <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              The BookNook Archive
            </p>
          </div>

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h1 className="max-w-3xl font-heading text-6xl leading-[0.95] text-foreground sm:text-7xl lg:text-8xl">
                Explore the
                <br />
                <span className="italic text-accent">library.</span>
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-7 text-muted">
                A growing collection of stories, knowledge and perspectives.
                Find your next great read among the shelves of BookNook.
              </p>
            </div>

            <div className="flex items-center gap-4 lg:pb-2">
              <div className="h-12 w-px bg-white/15" />

              <div>
                <p className="font-heading text-4xl text-foreground">
                  {loading ? "—" : stats.totalBooks.toString().padStart(2, "0")}
                </p>

                <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.2em] text-muted">
                  Books in collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1440px]">
          {/* Collection Statistics */}
          <div className="mb-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              {
                label: "Total Books",
                value: stats.totalBooks,
                icon: "▤",
              },
              {
                label: "Categories",
                value: stats.totalCategories,
                icon: "◈",
              },
              {
                label: "Available Copies",
                value: stats.availableCopies,
                icon: "↗",
              },
              {
                label: "Featured Titles",
                value: stats.featuredBooks,
                icon: "★",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/[0.08] bg-[#191D1A] p-5 transition-colors hover:border-[#D5FF3F]/30 sm:p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    {stat.label}
                  </span>

                  <span className="text-lg text-accent">{stat.icon}</span>
                </div>

                <p className="font-heading text-4xl text-foreground sm:text-5xl">
                  {loading ? "—" : stat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Catalogue Heading */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                Find your next read
              </p>

              <h2 className="font-heading text-4xl text-foreground sm:text-5xl">
                The Collection<span className="text-accent">.</span>
              </h2>
            </div>

            <p className="text-xs text-muted">Browse, discover and explore.</p>
          </div>

          {/* Search */}
          <div className="mb-7">
            <div className="relative">
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-muted">
                ⌕
              </span>

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, author, ISBN, publisher, tags..."
                className="w-full rounded-xl border border-white/10 bg-[#191D1A] py-4 pl-12 pr-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
              />
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="mb-7 flex flex-col gap-5 border-b border-white/[0.08] pb-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setQuickFilter(filter.value)}
                  className={`rounded-lg px-4 py-2.5 font-ui text-[11px] font-semibold transition-all ${
                    quickFilter === filter.value
                      ? "bg-accent text-[#101211]"
                      : "border border-white/10 bg-[#191D1A] text-muted hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#191D1A] px-4 py-3 text-xs text-foreground outline-none focus:border-accent"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#191D1A] px-4 py-3 text-xs text-foreground outline-none focus:border-accent"
              >
                <option value="newest">Newest First</option>
                <option value="title">Title: A – Z</option>
                <option value="year">Publication Year</option>
              </select>
            </div>
          </div>

          {/* Results Information */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <p className="font-ui text-xs text-muted">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {loading ? "—" : filteredBooks.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {loading ? "—" : books.length}
              </span>{" "}
              books
            </p>

            {(search ||
              category !== "All Categories" ||
              quickFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                  setQuickFilter("all");
                }}
                className="font-ui text-[10px] font-semibold uppercase tracking-wider text-accent hover:text-[#C1EA2F]"
              >
                Clear Filters ↗
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
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
            <div className="rounded-xl border border-white/10 bg-[#191D1A] px-6 py-16 text-center">
              <p className="font-heading text-3xl text-foreground">
                Something went wrong.
              </p>

              <p className="mt-3 text-sm text-muted">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-lg bg-accent px-6 py-3 font-ui text-xs font-bold uppercase tracking-wider text-[#101211]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredBooks.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-[#191D1A] px-6 py-20 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#222823] text-3xl text-accent">
                ⌕
              </div>

              <h3 className="font-heading text-3xl text-foreground sm:text-4xl">
                No books found<span className="text-accent">.</span>
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted">
                We couldn't find any books matching your current search or
                filters. Try exploring another category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                  setQuickFilter("all");
                }}
                className="mt-7 rounded-lg bg-accent px-6 py-3 font-ui text-xs font-bold uppercase tracking-wider text-[#101211] transition-colors hover:bg-[#C1EA2F]"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Book Collection */}
          {!loading && !error && filteredBooks.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}

          {/* Bottom Note */}
          {!loading && !error && books.length > 0 && (
            <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center">
              <p className="text-xs leading-6 text-muted">
                Every book has a story. Find the one that speaks to you.
              </p>

              <Link
                href="/"
                className="font-ui text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:text-[#C1EA2F]"
              >
                Back to Home ↗
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
