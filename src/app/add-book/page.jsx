"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const initialForm = {
  title: "",
  subtitle: "",
  author: "",
  category: "",
  image: "",
  description: "",
  isbn: "",
  publisher: "",
  publishedYear: "",
  pages: "",
  language: "English",
  format: "Paperback",
  tags: "",
  featured: false,
  totalCopies: "",
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/10";

const labelClass = "mb-2.5 block font-ui text-sm font-medium text-foreground";

const categories = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Biography",
  "Technology",
  "Fantasy",
  "Mystery",
  "Romance",
  "Other",
];

function SectionHeading({ number, title, description }) {
  return (
    <div className="mb-7 flex items-start gap-4 border-b border-border pb-5">
      <span className="font-ui text-xs font-bold tracking-widest text-accent">
        {number}
      </span>

      <div>
        <h2 className="font-ui text-lg font-semibold text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
      </div>
    </div>
  );
}

function Field({ label, optional, children }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {optional && (
          <span className="ml-2 text-xs font-normal text-muted">Optional</span>
        )}
      </label>
      {children}
    </div>
  );
}

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

  const handleFeaturedToggle = () => {
    setForm((prev) => ({
      ...prev,
      featured: !prev.featured,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const currentYear = new Date().getFullYear();

    if (
      form.publishedYear &&
      (!Number.isInteger(Number(form.publishedYear)) ||
        Number(form.publishedYear) < 1 ||
        Number(form.publishedYear) > currentYear)
    ) {
      setError("Please enter a valid publication year.");
      return;
    }

    if (
      form.pages &&
      (!Number.isInteger(Number(form.pages)) || Number(form.pages) < 1)
    ) {
      setError("Please enter a valid page count.");
      return;
    }

    if (
      !Number.isInteger(Number(form.totalCopies)) ||
      Number(form.totalCopies) < 1
    ) {
      setError("Total copies must be at least 1.");
      return;
    }

    setLoading(true);

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
          publishedYear: form.publishedYear
            ? Number(form.publishedYear)
            : undefined,
          pages: form.pages ? Number(form.pages) : undefined,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add book.");
      }

      setMessage("Your book has been added to the collection.");
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

  const previewTags = form.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <section className="min-h-screen bg-background px-5 py-12 md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-12 border-b border-border pb-10 md:mb-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-accent" />
            <p className="font-ui text-xs font-bold uppercase tracking-[0.25em] text-accent">
              BookNook / Collection Management
            </p>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="max-w-3xl font-heading text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
                Every book has
                <br />a story to{" "}
                <span className="italic text-accent">tell.</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-muted">
                Expand the BookNook collection. Add the details, publication
                information and inventory of a new title.
              </p>
            </div>

            <div className="hidden border-l border-border pl-6 lg:block">
              <p className="font-ui text-xs uppercase tracking-widest text-muted">
                Your workspace
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                Add a new title
              </p>
              <p className="mt-1 text-xs text-muted">Collection contributor</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_370px]">
            {/* Main Form */}
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <SectionHeading
                  number="01"
                  title="Basic information"
                  description="Start with the essential identity of the book."
                />

                <div className="space-y-6">
                  <Field label="Book title">
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter the full book title"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Subtitle" optional>
                    <input
                      type="text"
                      name="subtitle"
                      value={form.subtitle}
                      onChange={handleChange}
                      placeholder="e.g. A Novel"
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Author">
                      <input
                        type="text"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        required
                        placeholder="Author's full name"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Category">
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Description" optional>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell readers what makes this book worth reading..."
                      className={`${inputClass} resize-y leading-7`}
                    />
                  </Field>
                </div>
              </div>

              {/* Publication Details */}
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <SectionHeading
                  number="02"
                  title="Publication details"
                  description="Additional information that helps readers discover and understand the book."
                />

                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Publisher" optional>
                      <input
                        type="text"
                        name="publisher"
                        value={form.publisher}
                        onChange={handleChange}
                        placeholder="e.g. Penguin Random House"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="ISBN" optional>
                      <input
                        type="text"
                        name="isbn"
                        value={form.isbn}
                        onChange={handleChange}
                        placeholder="ISBN-10 or ISBN-13"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Published year" optional>
                      <input
                        type="number"
                        name="publishedYear"
                        value={form.publishedYear}
                        onChange={handleChange}
                        min="1"
                        max={new Date().getFullYear()}
                        placeholder="e.g. 1925"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Number of pages" optional>
                      <input
                        type="number"
                        name="pages"
                        value={form.pages}
                        onChange={handleChange}
                        min="1"
                        step="1"
                        placeholder="e.g. 180"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Language">
                      <select
                        name="language"
                        value={form.language}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="English">English</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Hindi">Hindi</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>

                    <Field label="Book format">
                      <select
                        name="format"
                        value={form.format}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="Paperback">Paperback</option>
                        <option value="Hardcover">Hardcover</option>
                        <option value="E-book">E-book</option>
                        <option value="Audiobook">Audiobook</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Tags" optional>
                    <input
                      type="text"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="Classic, Literature, American Dream"
                      className={inputClass}
                    />
                    <p className="mt-2 text-xs leading-5 text-muted">
                      Separate keywords with commas. These can help organize and
                      discover books.
                    </p>
                  </Field>
                </div>
              </div>

              {/* Library Inventory */}
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <SectionHeading
                  number="03"
                  title="Library inventory"
                  description="Set up the physical collection and homepage visibility."
                />

                <div className="space-y-6">
                  <Field label="Total copies">
                    <input
                      type="number"
                      name="totalCopies"
                      value={form.totalCopies}
                      onChange={handleChange}
                      required
                      min="1"
                      step="1"
                      placeholder="How many copies are available?"
                      className={inputClass}
                    />
                    <p className="mt-2 text-xs text-muted">
                      Available copies will automatically start at the total
                      number of copies.
                    </p>
                  </Field>

                  <div className="flex items-center justify-between gap-5 rounded-xl border border-border bg-background p-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-ui text-sm font-semibold text-foreground">
                          Featured collection
                        </p>
                        {form.featured && (
                          <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                            Enabled
                          </span>
                        )}
                      </div>

                      <p className="mt-2 max-w-sm text-xs leading-5 text-muted">
                        Mark this title as eligible for the homepage featured
                        collection.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleFeaturedToggle}
                      aria-label="Toggle featured book"
                      aria-pressed={form.featured}
                      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                        form.featured ? "bg-accent" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full transition-all ${
                          form.featured
                            ? "left-6 bg-background"
                            : "left-1 bg-muted"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Feedback */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  role="status"
                  className="rounded-xl border border-accent/20 bg-accent/10 p-4 text-sm text-accent"
                >
                  {message}
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-muted">
                  Fields marked with * are required.
                  <br />
                  Your book will be added to the library collection.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-accent px-8 py-4 font-ui text-sm font-bold text-[#101211] transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(213,255,63,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "ADDING TO COLLECTION..."
                    : "ADD BOOK TO LIBRARY ↗"}
                </button>
              </div>
            </div>

            {/* Live Preview Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <p className="font-ui text-xs font-bold uppercase tracking-widest text-foreground">
                    Live preview
                  </p>
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Preview
                  </span>
                </div>

                <div className="p-5">
                  <div className="relative mx-auto flex aspect-[3/4] max-h-[360px] w-full max-w-[240px] items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt={form.title || "Book cover preview"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="px-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
                          <span className="font-heading text-3xl italic text-accent">
                            B.
                          </span>
                        </div>
                        <p className="font-ui text-xs uppercase tracking-widest text-muted">
                          Cover preview
                        </p>
                        <p className="mt-2 text-[10px] text-muted/60">
                          Add an image URL to see your cover.
                        </p>
                      </div>
                    )}

                    {form.featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#101211]">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="mt-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                      {form.category || "Book category"}
                    </p>

                    <h3 className="mt-3 break-words font-heading text-3xl leading-tight text-foreground">
                      {form.title || "Your book title"}
                    </h3>

                    {form.subtitle && (
                      <p className="mt-1 text-sm italic text-muted">
                        {form.subtitle}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-muted">
                      {form.author ? `By ${form.author}` : "Author name"}
                    </p>

                    {form.description && (
                      <p className="mt-5 line-clamp-4 text-xs leading-6 text-muted">
                        {form.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Published
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {form.publishedYear || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Pages
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {form.pages || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Language
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {form.language}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Format
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {form.format}
                      </p>
                    </div>
                  </div>

                  {previewTags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                      {previewTags.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="rounded-full border border-border bg-background px-3 py-1.5 text-[10px] text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Inventory Summary */}
              <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="font-ui text-xs font-bold uppercase tracking-widest text-muted">
                  Inventory summary
                </p>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="font-heading text-4xl text-foreground">
                      {form.totalCopies || "0"}
                    </p>
                    <p className="mt-1 text-xs text-muted">Total copies</p>
                  </div>

                  <div className="text-right">
                    <p className="font-heading text-3xl text-accent">
                      {form.totalCopies || "0"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Initial availability
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{
                      width: form.totalCopies ? "100%" : "0%",
                    }}
                  />
                </div>
              </div>

              <p className="px-2 text-center text-[11px] leading-5 text-muted">
                A growing collection. A new story. Another reason to explore.
              </p>
            </aside>
          </div>
        </form>
      </div>
    </section>
  );
}
