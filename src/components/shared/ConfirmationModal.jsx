"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Hash,
  UserRound,
  X,
} from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  book,
  actionType = "delete",
  isLoading = false,
}) {
  const isDelete = actionType === "delete";

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !book) return null;

  const title = book.title || book.name || "Untitled Book";
  const author = book.author || "Unknown Author";
  const category = book.category || "Uncategorized";
  const image =
    book.coverImage || book.image || book.imageUrl || book.thumbnail || "";

  const isbn = book.isbn || book.ISBN || "";
  const publishedYear =
    book.publishedYear || book.year || book.publicationYear || "";

  const handleConfirm = () => {
    if (!isLoading) onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={() => !isLoading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#121318] shadow-[0_25px_100px_rgba(0,0,0,0.65)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Top accent */}
        <div
          className={`h-1 w-full ${isDelete ? "bg-red-500" : "bg-[#C2F800]"}`}
        />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close modal"
          className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X size={18} />
        </button>

        <div className="p-5 sm:p-7">
          {/* Icon and heading */}
          <div className="flex items-start gap-4 pr-8">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isDelete
                  ? "bg-red-500/10 text-red-400"
                  : "bg-[#C2F800]/10 text-[#C2F800]"
              }`}
            >
              {isDelete ? <AlertTriangle size={23} /> : <BookOpen size={23} />}
            </div>

            <div>
              <h2
                id="confirmation-title"
                className="text-xl font-bold tracking-tight text-white sm:text-2xl"
              >
                {isDelete ? "Delete this book?" : "Return this book?"}
              </h2>

              <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                {isDelete
                  ? "You're about to permanently remove this book from your collection."
                  : "Please confirm that you want to return this borrowed book."}
              </p>
            </div>
          </div>

          {/* Book details */}
          <div className="mt-6 rounded-xl border border-white/10 bg-[#1A1B21] p-4">
            <div className="flex gap-4">
              {/* Cover image */}
              <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#25262D]">
                {image ? (
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-500">
                    <BookOpen size={28} />
                    <span className="text-[10px]">No Cover</span>
                  </div>
                )}
              </div>

              {/* Basic information */}
              <div className="min-w-0 flex-1 py-1">
                <span className="inline-flex rounded-md border border-[#C2F800]/20 bg-[#C2F800]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#C2F800]">
                  {category}
                </span>

                <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">
                  {title}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
                  <UserRound size={13} />
                  <span className="truncate">{author}</span>
                </p>
              </div>
            </div>

            {/* Additional information */}
            {(isbn || publishedYear) && (
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                {isbn && (
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Hash size={12} />
                      ISBN
                    </p>
                    <p className="mt-1 truncate text-xs font-medium text-gray-300">
                      {isbn}
                    </p>
                  </div>
                )}

                {publishedYear && (
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <CalendarDays size={12} />
                      Published
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-300">
                      {publishedYear}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Warning message */}
          <div
            className={`mt-4 flex gap-2.5 rounded-lg p-3 ${
              isDelete
                ? "border border-red-500/15 bg-red-500/5"
                : "border border-[#C2F800]/15 bg-[#C2F800]/5"
            }`}
          >
            <AlertTriangle
              size={16}
              className={`mt-0.5 shrink-0 ${
                isDelete ? "text-red-400" : "text-[#C2F800]"
              }`}
            />

            <p className="text-xs leading-relaxed text-gray-400">
              {isDelete
                ? "This action cannot be undone. Make sure this is the correct book before proceeding."
                : "Make sure you have selected the correct book before confirming your return."}
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={15} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isDelete
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-[#C2F800] text-[#11130B] hover:bg-[#D4FF32]"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {isDelete ? "Delete Book" : "Return Book"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
