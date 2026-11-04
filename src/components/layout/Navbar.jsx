import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101211]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* Brand */}
        <Link href="/" className="font-ui text-2xl font-bold tracking-tight">
          BOOKNOOK<span className="text-accent">.</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-9 font-ui text-sm font-medium text-muted md:flex">
          <Link href="/" className="text-accent">
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
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
