import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://poyraz.co"),
  title: {
    default: "Eyüp Can Poyraz | Product and Growth Marketer",
    template: "%s | Eyüp Can Poyraz",
  },
  description:
    "Crafting valuable resources and expressing my thoughts about product and marketing in tech.",
  openGraph: {
    type: "website",
    siteName: "Eyüp Can Poyraz",
    locale: "en_US",
    url: "https://poyraz.co",
  },
  twitter: { card: "summary_large_image", creator: "@eyuppoyraz" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="hidden md:block md:w-64 md:shrink-0 md:border-r md:border-border">
              <div className="sticky top-0 flex h-screen flex-col">
                <Sidebar />
              </div>
            </aside>
            <MobileNav />
            <main className="flex-1 px-6 pt-8 pb-28 md:px-12 md:py-10">
              <div className="mx-auto max-w-3xl">{children}</div>
            </main>
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-FZREW91PD2" />
      </body>
    </html>
  );
}
