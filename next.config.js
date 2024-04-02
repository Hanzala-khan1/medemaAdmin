/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_KEY: process.env.NEXT_APP_API_KEY,
    PRIVATE_KEY_ID: process.env.NEXT_APP_PRIVATE_KEY_ID,
    PRIVATE_KEY:process.env.NEXT_APP_PRIVATE_KEY
  },
  images: {
    domains: ['firebasestorage.googleapis.com',"lh3.googleusercontent.com","graph.facebook.com","lh3.googleusercontent.com"],
  },
  babel: {
    presets: ['next/babel'],
    plugins: [
      [
        "import",
        {
          libraryName: "antd",
          style: true,
        },
      ],
    ],
  },
};

module.exports = nextConfig;
