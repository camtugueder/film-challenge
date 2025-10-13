import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Suppress OpenTelemetry instrumentation warnings from Sentry
    if (isServer) {
      config.ignoreWarnings = [
        { module: /@opentelemetry\/instrumentation/ },
        { module: /@prisma\/instrumentation/ },
      ];
    }
    return config;
  },
};

export default nextConfig;
