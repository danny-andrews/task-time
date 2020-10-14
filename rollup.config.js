/* eslint-env node */
import createConfig from "./create-config.js";

const env = process.env.NODE_ENV || "development";

export default createConfig(
  {
    isProd: env === "production",
    envVars: { "process.env.NODE_ENV": env },
    outputDir: "build",
    analyzeBuild: Boolean(process.env.ANALYZE_BUILD),
  },
  {
    input: "src/index.js",
    output: {
      globals: {
        crypto: "crypto",
      },
    },
    external: ["crypto"],
  }
);
