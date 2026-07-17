/** @type {import('next').NextConfig} */
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  ...(isStatic
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
