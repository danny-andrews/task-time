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
import * as R from "ramda";

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
  R.pipe(
    R.toPairs,
    R.map(([key, value]) => [transformKey(key), transformValue(value)]),
    R.fromPairs
  );

export default ({ isProd, envVars, outputDir, analyzeBuild }, config) => {
  const isDev = !isProd;
  const hashAssets = isProd;
  const minifyAssets = isProd;
  const envVarObj = mapObj(
    (key) => `process.env.${key}`,
    JSON.stringify
  )(envVars);
  const publicPath = isProd ? "task-time" : "";
  const output = config.output || [];
  const plugins = config.plugins || [];

  return {
    ...config,
    output: {
      format: "iife",
      dir: outputDir,
      entryFileNames: hashAssets ? "[name]-[hash].js" : "[name].js",
      ...output,
    },
    plugins: [
      ...(R.isNil(envVars) ? [] : [replace(envVarObj)]),
      commonjs(),
      resolve({ browser: true }),
      babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
      ...(minifyAssets ? [terser()] : []),
      postcss({
        autoModules: true,
        extract: true,
        modules: {
          // Chances of collision for a 6-digit, base52 string is less than one
          // in a million (~0.01%), assuming you have no more than 2000 distinct
          // class names in your css. And if you do, shame on you.
          generateScopedName: isProd
            ? "[hash:base52:6]"
            : "[folder]_[local]_[hash:base52:2]",
        },
        minimize: minifyAssets,
      }),
      html({
        template: htmlTemplate,
        publicPath,
      }),
      json(),
      ...(analyzeBuild ? [analyze({ summaryOnly: true })] : []),
      ...(isProd ? [brotli()] : []),
      ...(isDev ? [serve(outputDir)] : []),
      ...(isDev ? [livereload({ watch: outputDir })] : []),
      ...plugins,
    ],
  };
};
