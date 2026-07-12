import Link from "next/link";
import { NAV_GROUPS } from "@/lib/nav";
import { XIcon, LinkedInIcon } from "@/components/social-icons";

// Theme-independent black block: stays black in dark mode too.
export function Footer() {
  return (
    <footer className="bg-[#0b0b0b] text-white/60">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="flex max-w-xs flex-col gap-6">
            <Link
              href="/contact"
              className="mt-2 w-fit rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-85"
            >
              Get in touch
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {NAV_GROUPS.map((group, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <span className="label-mono mb-1 text-white/40">
                  {group.title ?? "Quick links"}
                </span>
                {group.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Eyüp Can Poyraz</p>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/eyuppoyraz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="transition-colors hover:text-white"
            >
              <XIcon className="size-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/eyuppoyraz/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-white"
            >
              <LinkedInIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
