"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyBooksPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    category: "",
    image: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const handleEdit = (book) => {
    setEditingBook(book);

    setEditForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      image: book.image || "",
      description: book.description || "",
    });
  };

  const handleUpdate = async () => {
    setSaving(true);

    try {
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Unable to verify your session.");
      }

      const response = await fetch(`${API_URL}/books/${editingBook._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update book.");
      }

      setBooks((prev) =>
        prev.map((book) =>
          book._id === editingBook._id ? { ...book, ...editForm } : book,
        ),
      );

      setEditingBook(null);
      alert("Book updated successfully!");
    } catch (err) {
      alert(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login?callbackURL=/my-books");
      return;
    }

    const fetchMyBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load books.");
        }

        const myBooks = (result.books || []).filter(
          (book) => book.addedByEmail === session.user.email,
        );

        setBooks(myBooks);
      } catch (err) {
        setError(err.message || "Unable to load your books.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <p className="font-ui text-sm tracking-widest text-accent">
          LOADING YOUR BOOKS...
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
  const editModal = editingBook && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-3xl">Edit Book</h2>

          <button
            onClick={() => setEditingBook(null)}
            className="text-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {[
            ["title", "Book Title"],
            ["author", "Author"],
            ["category", "Category"],
            ["image", "Cover Image URL"],
          ].map(([name, label]) => (
            <input
              key={name}
              type="text"
              placeholder={label}
              value={editForm[name]}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  [name]: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          ))}

          <textarea
            placeholder="Book Description"
            rows={4}
            value={editForm.description}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setEditingBook(null)}
            className="rounded-lg border border-border px-5 py-3 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-3 text-sm font-bold text-background disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {editModal}

      <section className="min-h-screen bg-background px-5 py-16 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Your Collection
              </p>

              <h1 className="mt-4 font-heading text-5xl text-foreground sm:text-6xl">
                My Books<span className="text-accent">.</span>
              </h1>

              <p className="mt-4 text-sm text-muted">
                Manage the books you've added to our library.
              </p>
            </div>

            <Link
              href="/add-book"
              className="w-fit rounded-lg bg-accent px-6 py-3 font-ui text-sm font-bold text-[#101211] transition-colors hover:bg-accent-hover"
            >
              ADD NEW BOOK ↗
            </Link>
          </div>

          {books.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface px-6 py-20 text-center">
              <h2 className="font-heading text-3xl text-foreground">
                Nothing on your shelf yet.
              </h2>

              <p className="mt-3 text-sm text-muted">
                Start building your collection by adding your first book.
              </p>

              <Link
                href="/add-book"
                className="mt-7 inline-block rounded-lg bg-accent px-6 py-3 font-ui text-sm font-bold text-[#101211] hover:bg-accent-hover"
              >
                ADD A BOOK ↗
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <article
                  key={book._id}
                  className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#222823]">
                    <img
                      src={book.image || "/placeholder-book.png"}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <p className="font-ui text-xs font-semibold uppercase tracking-wider text-accent">
                      {book.category}
                    </p>

                    <h2 className="mt-3 font-heading text-2xl text-foreground">
                      {book.title}
                    </h2>

                    <p className="mt-2 text-sm text-muted">By {book.author}</p>

                    <div className="mt-5 flex justify-between border-t border-border pt-5 text-sm">
                      <span className="text-muted">Available copies</span>
                      <span className="font-semibold text-accent">
                        {book.availableCopies} / {book.totalCopies}
                      </span>
                    </div>

                    <Link
                      href={`/books/${book._id}`}
                      className="mt-6 block rounded-lg border border-border px-5 py-3 text-center font-ui text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      VIEW DETAILS ↗
                    </Link>
                    <button
                      onClick={() => handleEdit(book)}
                      className="mt-3 w-full rounded-lg border border-accent px-4 py-3 text-sm font-bold text-accent hover:bg-accent hover:text-background"
                    >
                      EDIT BOOK
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
