// Canonical site origin. The live site is served from www (apex 308s to www),
// so every absolute URL we emit (canonical, OG, sitemap, robots, JSON-LD)
// must use this host to avoid canonical-to-redirect conflicts.
export const SITE_URL = "https://www.poyraz.co";
