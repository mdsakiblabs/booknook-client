import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#101211]">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-16 md:px-10 md:pt-24">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          {/* Brand */}
          <div className="max-w-md">
            <Link
              href="/"
              className="font-ui text-3xl font-bold tracking-tight"
            >
              BOOKNOOK<span className="text-accent">.</span>
            </Link>

            <p className="mt-5 max-w-sm font-body text-sm leading-7 text-muted">
              A little corner for every book lover. Discover stories, explore
              ideas, and find your next favorite read.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-12 sm:gap-20">
            <div>
              <h3 className="mb-5 font-ui text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Explore
              </h3>

              <ul className="space-y-4 font-ui text-sm text-muted">
                <li>
                  <Link href="/books" className="hover:text-foreground">
                    All Books
                  </Link>
                </li>
                <li>
                  <Link href="/add-book" className="hover:text-foreground">
                    Add a Book
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-5 font-ui text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Account
              </h3>

              <ul className="space-y-4 font-ui text-sm text-muted">
                <li>
                  <Link href="/login" className="hover:text-foreground">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-foreground">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} BookNook. All rights reserved.</p>

          <p className="font-ui tracking-wide">
            MADE FOR THE LOVE OF READING.
            <span className="ml-2 text-accent">✳</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
