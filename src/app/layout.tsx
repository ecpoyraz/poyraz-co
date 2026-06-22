import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
