import type { NextConfig } from "next";

const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  import("velite").then((m) => m.build({ watch: isDev, clean: !isDev }));
}

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      {
        source: "/notebook/how-to-use-chatgpt-as-a-marketer",
        destination: "/notebook/how-to-use-ai-as-a-marketer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
