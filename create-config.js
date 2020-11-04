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
import analyze from "rollup-plugin-analyzer";
import brotli from "rollup-plugin-brotli";
import { map, isNil, pipe, toPairs, fromPairs } from "ramda";

const htmlTemplate = ({ files, publicPath }) => {
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
    ${files.css
      .map(
        ({ fileName }) =>
          `<link rel="stylesheet" type="text/css" href="${publicPath}/${fileName}"/>`
      )
      .join("\n")}
    ${files.js
      .map(
        ({ fileName }) =>
          `<script src="${publicPath}/${fileName}" defer></script>`
      )
      .join("\n")}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <main id="root"></main>
  </body>
</html>
`.trim();
};

const mapObj = (transformKey, transformValue) =>
  pipe(
    toPairs,
    map(([key, value]) => [transformKey(key), transformValue(value)]),
    fromPairs
  );

export default ({ isProd, envVars, outputDir, analyzeBuild }, config) => {
  const isDev = !isProd;
  const hashAssets = isProd;
  const minifyAssets = isProd;
  const envVarObj = mapObj(
    (key) => `process.env.${key}`,
    JSON.stringify
  )(envVars);

  return {
    ...config,
    output: {
      format: "umd",
      dir: outputDir,
      entryFileNames: hashAssets ? "[name]-[hash].js" : "[name].js",
      ...config.output,
    },
    plugins: [
      ...(isNil(envVars) ? [] : [replace(envVarObj)]),
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
      ...(analyzeBuild ? [analyze({ summaryOnly: true })] : []),
      ...(isProd ? [brotli()] : []),
      ...(isDev ? [serve(outputDir)] : []),
      ...(isDev ? [livereload({ watch: outputDir })] : []),
    ],
  };
};
