import Link from "next/link";

const BookCard = ({ book }) => {
  const tags = Array.isArray(book.tags) ? book.tags : [];

  const hasAvailability = typeof book.availableCopies === "number";

  const isAvailable = hasAvailability ? book.availableCopies > 0 : null;

  return (
    <Link href={`/books/${book._id}`} className="group block min-w-0">
      <article className="h-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#191D1A] transition-all duration-300 hover:-translate-y-1 hover:border-[#D5FF3F]/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
        {/* Book Cover */}
        <div className="relative overflow-hidden bg-[#222823]">
          <img
            src={book.image || "/placeholder-book.png"}
            alt={book.title || "Book cover"}
            className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

          {/* Featured Badge */}
          {book.featured && (
            <span className="absolute left-3 top-3 rounded-md border border-[#D5FF3F]/30 bg-[#101211]/90 px-2.5 py-1 font-ui text-[9px] font-bold uppercase tracking-[0.15em] text-[#D5FF3F] backdrop-blur-md">
              ★ Featured
            </span>
          )}

          {/* Availability */}
          <span
            className={`absolute bottom-3 left-3 rounded-md px-2.5 py-1 font-ui text-[9px] font-semibold uppercase tracking-wider backdrop-blur-md ${
              isAvailable === null
                ? "bg-black/60 text-white/80"
                : isAvailable
                  ? "bg-[#D5FF3F] text-[#101211]"
                  : "bg-red-500/90 text-white"
            }`}
          >
            {isAvailable === null
              ? "Availability unknown"
              : isAvailable
                ? `${book.availableCopies} Copies Available`
                : "Currently Unavailable"}
          </span>

          {/* View Icon */}
          <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#D5FF3F] text-lg text-[#101211] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            ↗
          </span>
        </div>

        {/* Book Information */}
        <div className="flex h-full flex-col p-4">
          {/* Category */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="truncate font-ui text-[10px] font-bold uppercase tracking-[0.16em] text-[#D5FF3F]">
              {book.category || "Uncategorized"}
            </span>

            {book.format && (
              <span className="shrink-0 rounded border border-white/10 px-2 py-1 font-ui text-[9px] uppercase tracking-wider text-[#A7ADA5]">
                {book.format}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 font-ui text-base font-semibold leading-snug text-[#F0EEE8] transition-colors group-hover:text-[#D5FF3F]">
            {book.title}
          </h3>

          {/* Subtitle */}
          {book.subtitle && (
            <p className="mt-1 line-clamp-1 text-xs italic text-[#A7ADA5]">
              {book.subtitle}
            </p>
          )}

          {/* Author */}
          <p className="mt-2 truncate text-xs text-[#A7ADA5]">
            by {book.author}
          </p>

          {/* Publisher */}
          {book.publisher && (
            <p className="mt-3 truncate border-t border-white/[0.07] pt-3 text-[11px] text-[#A7ADA5]">
              Published by{" "}
              <span className="text-[#F0EEE8]">{book.publisher}</span>
            </p>
          )}

          {/* Publication Metadata */}
          {(book.publishedYear || book.pages || book.language) && (
            <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-lg bg-[#222823]/70 py-2.5">
              <div className="px-1 text-center">
                <p className="font-ui text-xs font-semibold text-[#F0EEE8]">
                  {book.publishedYear || "—"}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-wider text-[#A7ADA5]">
                  Year
                </p>
              </div>

              <div className="px-1 text-center">
                <p className="font-ui text-xs font-semibold text-[#F0EEE8]">
                  {book.pages ? `${book.pages}` : "—"}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-wider text-[#A7ADA5]">
                  Pages
                </p>
              </div>

              <div className="min-w-0 px-1 text-center">
                <p className="truncate font-ui text-xs font-semibold text-[#F0EEE8]">
                  {book.language || "—"}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-wider text-[#A7ADA5]">
                  Language
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-full border border-white/10 px-2 py-1 text-[9px] text-[#A7ADA5]"
                >
                  #{tag}
                </span>
              ))}

              {tags.length > 2 && (
                <span className="px-1 py-1 text-[9px] text-[#A7ADA5]">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Bottom Action */}
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">
            <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A7ADA5] transition-colors group-hover:text-[#D5FF3F]">
              Explore Book
            </span>

            <span className="text-sm text-[#D5FF3F]">↗</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BookCard;
