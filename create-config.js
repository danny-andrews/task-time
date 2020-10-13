import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import html from "@rollup/plugin-html";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import json from "@rollup/plugin-json";
import livereload from "rollup-plugin-livereload";
import { map, isNil } from "ramda";

const htmlTemplate = ({ files }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content="Task Time - TODO List" />
        <title>Task Time</title>
        ${files.js
          .map(({ fileName }) => `<script src="./${fileName}" defer></script>`)
          .join("\n")}
        ${files.css
          .map(
            ({ fileName }) =>
              `<link rel="stylesheet" type="text/css" href="./${fileName}"></link>`
          )
          .join("\n")}
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <main id="root"></main>
      </body>
    </html>
  `;
};

export default ({ isProd, envVars, outputDir }, config) => {
  const isDev = !isProd;
  const hashAssets = isProd;
  const minifyAssets = isProd;

  return {
    ...config,
    output: {
      format: "umd",
      dir: outputDir,
      entryFileNames: hashAssets ? "[name]-[hash].js" : "[name].js",
      ...config.output,
    },
    plugins: [
      ...(isNil(envVars) ? [] : [replace(map(JSON.stringify, envVars))]),
      commonjs(),
      resolve({ browser: true }),
      babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
      ...(minifyAssets ? [terser()] : []),
      postcss({
        autoModules: true,
        extract: true,
        minimize: minifyAssets,
      }),
      html({
        template: htmlTemplate,
      }),
      json(),
      ...(isDev ? [serve(outputDir)] : []),
      ...(isDev ? [livereload({ watch: "build" })] : []),
    ],
  };
};
