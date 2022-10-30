/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    runtime: "nodejs",
    serverComponents: true,
    appDir: true,
  },
  images: {
    domains: ["imagedelivery.net"],
  },
};
