
import { Instrument_Serif, Space_Grotesk, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "BookNook — After Dark",
  description: "A little corner for every book lover.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${spaceGrotesk.variable} ${inter.variable}`}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#17181C",
              color: "#F5F5F5",
              border: "1px solid #303137",
              borderRadius: "12px",
              fontFamily: "var(--font-inter)",
              fontSize: "13px",
            },
            success: {
              iconTheme: {
                primary: "#C2F800",
                secondary: "#17181C",
              },
            },
          }}
        />

        <Navbar />

        <main className="min-h-screen">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
