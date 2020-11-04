/* eslint-env node */
import createConfig from "./create-config.js";

const env = process.env.NODE_ENV || "development";
const isProd = env === "production";

export default createConfig(
  {
    isProd,
    envVars: {
      NODE_ENV: env,
      SYNC_WEBSOCKET_URL: isProd
        ? "ws://task-time-backend.herokuapp.com:3004"
        : "ws://localhost:3004",
    },
    outputDir: "task-time",
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
