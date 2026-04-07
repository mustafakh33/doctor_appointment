const remotePatterns = [
  {
    protocol: "http",
    hostname: "localhost",
  },
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
  },
];

const assetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;

if (assetBaseUrl) {
  try {
    const parsed = new URL(assetBaseUrl);
    remotePatterns.push({
      protocol: parsed.protocol.replace(":", ""),
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
    });
  } catch {
    // Ignore invalid env value and keep defaults.
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
