// Resolves and proxies the Open Graph image for a given URL so bookmarks can
// render their cover straight from the source, with no stored image files.
// Source OG images are re-encoded to a capped WebP before serving since
// they're rendered as a plain <img> (no next/image optimization applies).

import sharp from "sharp";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36";

function extractOgImage(html: string, base: string): string | null {
  const wanted = [
    "og:image",
    "og:image:url",
    "twitter:image",
    "twitter:image:src",
  ];
  const found: Record<string, string> = {};
  for (const tag of html.match(/<meta[^>]+>/gi) ?? []) {
    const key = /(?:property|name)=["']([^"']+)["']/i
      .exec(tag)?.[1]
      ?.toLowerCase();
    const content = /content=["']([^"']*)["']/i.exec(tag)?.[1];
    if (key && content && wanted.includes(key) && !found[key]) {
      found[key] = content;
    }
  }
  const raw =
    found["og:image"] ||
    found["og:image:url"] ||
    found["twitter:image"] ||
    found["twitter:image:src"];
  if (!raw) return null;
  try {
    return new URL(raw, base).toString();
  } catch {
    return null;
  }
}

function placeholder(target: string): Response {
  let host = "site";
  try {
    host = new URL(target).hostname.replace(/^www\./, "");
  } catch {}
  const letter = (host[0] ?? "?").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf0fb"/><stop offset="1" stop-color="#d9e2f4"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><text x="320" y="215" font-family="Inter, system-ui, sans-serif" font-size="140" font-weight="700" fill="#2563eb" text-anchor="middle">${letter}</text></svg>`;
  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=86400",
    },
  });
}

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get("url");
  if (!target) return new Response("missing url", { status: 400 });

  try {
    const page = await fetch(target, {
      headers: { "user-agent": UA, accept: "text/html,*/*" },
      signal: AbortSignal.timeout(8000),
    });
    if (!page.ok) return placeholder(target);

    const ogUrl = extractOgImage(await page.text(), target);
    if (!ogUrl) return placeholder(target);

    const img = await fetch(ogUrl, {
      headers: { "user-agent": UA, referer: target },
      signal: AbortSignal.timeout(8000),
    });
    if (!img.ok) return placeholder(target);

    const type = img.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) return placeholder(target);

    const cacheControl =
      "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800";
    const original = Buffer.from(await img.arrayBuffer());

    try {
      const resized = await sharp(original)
        .resize({ width: 640, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();
      return new Response(new Uint8Array(resized), {
        headers: {
          "content-type": "image/webp",
          "cache-control": cacheControl,
        },
      });
    } catch {
      // Source isn't a format sharp can decode (e.g. an unsupported raster
      // type); serve it as-is rather than dropping the bookmark cover.
      return new Response(new Uint8Array(original), {
        headers: { "content-type": type, "cache-control": cacheControl },
      });
    }
  } catch {
    return placeholder(target);
  }
}
