import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dokploy'da Docker ile: yalnız gereken dosyalar .next/standalone'a kopyalanır, imaj küçük kalır (Dockerfile)
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Next 16: izin verilmeyen quality değerleri yok sayılır (varsayılan yalnız 75).
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
