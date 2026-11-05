"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    setMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Explore Books" },
    { href: "/add-book", label: "Add Book" },
    { href: "/my-books", label: "My Books" },
    { href: "/my-borrows", label: "My Borrows" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101211]/90 backdrop-blur-xl">
      <nav className="relative mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="font-ui text-2xl font-bold tracking-tight"
        >
          BOOKNOOK<span className="text-accent">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 font-ui text-sm font-medium text-muted md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side: Authentication + Mobile Menu Button */}
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
                className="rounded-lg bg-accent px-3 py-2.5 font-ui text-xs font-bold !text-[#101211] transition-colors hover:bg-accent-hover sm:px-5 sm:text-sm"
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
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#191d1a] px-2 py-2 transition-colors hover:border-accent/50 sm:gap-3 sm:px-3"
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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#191d1a] transition-colors hover:border-accent/50 md:hidden"
          >
            <span
              className={`h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ${
                mobileMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ${
                mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-white/10 bg-[#101211] px-5 py-4 shadow-2xl md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 font-ui text-sm font-medium text-muted transition-colors hover:bg-[#191d1a] hover:text-accent"
                >
                  {link.label}
                  <span className="text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              ))}
            </div>

            {!isPending && !user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 block rounded-lg border border-white/10 px-4 py-3 text-center font-ui text-sm font-semibold text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Log in to your account
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
