import type { Metadata } from "next";
import { Inter, Fragment_Mono, Host_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThirdPartyScripts } from "@/components/third-party-scripts";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
});
const fragmentMono = Fragment_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fragment-mono",
});

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
    <html
      lang="en"
      className={`${inter.variable} ${hostGrotesk.variable} ${fragmentMono.variable}`}
    >
      <body>
        <div className="flex min-h-screen flex-col overflow-x-clip">
          <SmoothScroll />
          <SiteHeader />
          <main className="flex-1 px-5 pb-24 pt-10 md:px-10">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
          <Footer />
        </div>
        <GoogleAnalytics gaId="G-FZREW91PD2" />
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
