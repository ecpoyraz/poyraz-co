import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThirdPartyScripts } from "@/components/third-party-scripts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";

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
          <div className="flex min-h-screen flex-col overflow-x-clip">
            <SiteNav />
            <main className="flex-1 px-6 pb-16 pt-20 md:px-12 md:pb-20">
              <div className="mx-auto max-w-3xl">{children}</div>
            </main>
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-FZREW91PD2" />
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
