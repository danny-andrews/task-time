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
        ? "wss://task-time-backend.herokuapp.com"
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
    onwarn: (warning) => {
      const IGNORED_CIRCULAR = ["node_modules/lib0"];
      if (
        warning.code === "CIRCULAR_DEPENDENCY" &&
        IGNORED_CIRCULAR.some((d) => warning.importer.includes(d))
      ) {
        return;
      }
      throw Error(warning.message);
    },
  }
);
