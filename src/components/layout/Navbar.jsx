"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101211]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* Brand */}
        <Link href="/" className="font-ui text-2xl font-bold tracking-tight">
          BOOKNOOK<span className="text-accent">.</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-9 font-ui text-sm font-medium text-muted md:flex">
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>

          <Link href="/books" className="transition-colors hover:text-accent">
            Explore Books
          </Link>

          <Link
            href="/add-book"
            className="transition-colors hover:text-accent"
          >
            Add Book
          </Link>

          <Link
            href="/my-books"
            className="transition-colors hover:text-accent"
          >
            My Books
          </Link>

          <Link
            href="/my-borrows"
            className="transition-colors hover:text-accent"
          >
            My Borrows
          </Link>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-3">
          {!isPending && !user && (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg border border-white/15 px-5 py-2.5 font-ui text-sm font-semibold transition-colors hover:border-accent hover:text-accent sm:block"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-accent px-5 py-2.5 font-ui text-sm font-bold text-[#101211] transition-colors hover:bg-accent-hover"
              >
                Get Started <span aria-hidden="true">↗</span>
              </Link>
            </>
          )}

          {isPending && (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-[#222823]" />
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#191d1a] px-3 py-2 transition-colors hover:border-accent/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-ui text-sm font-bold text-[#101211]">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>

                <span className="hidden max-w-28 truncate font-ui text-sm font-semibold text-foreground sm:block">
                  {user.name}
                </span>

                <span className="text-xs text-muted">
                  {menuOpen ? "▲" : "▼"}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-xl border border-border bg-[#191d1a] p-2 shadow-2xl">
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="truncate font-ui text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted">
                      {user.email}
                    </p>
                  </div>

                  <div className="space-y-1 py-2">
                    <Link
                      href="/my-books"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-[#222823] hover:text-accent"
                    >
                      My Books
                    </Link>

                    <Link
                      href="/my-borrows"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-[#222823] hover:text-accent"
                    >
                      My Borrows
                    </Link>
                  </div>

                  <div className="border-t border-white/10 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg px-3 py-2.5 text-left font-ui text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      Log out ↗
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
