import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Eyüp Can Poyraz",
  description: "Marketer scaling tech products to maximize user value.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col md:flex-row">
            <div className="hidden md:block md:w-64 md:shrink-0 md:border-r md:border-border">
              <div className="sticky top-0">
                <Sidebar />
              </div>
            </div>
            <MobileNav />
            <main className="flex-1 px-6 py-10 md:px-12">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
