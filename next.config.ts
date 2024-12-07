import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // webpack: (config) => {
  //   config.externals.push({
  //     "utf-8-validate": "commonjs utf-8-validate",
  //     bufferutil: "commonjs bufferutil",
  //   });
  // },
  images: {
    domains: ["uploadthing.com", "utfs.io"],
  },
  /* config options here */
};

export default nextConfig;
