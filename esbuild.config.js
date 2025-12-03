import esbuild from "esbuild";

await esbuild
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: false,
    outfile: "dist/index.js",
    platform: "node",
    target: "esnext",
    format: "esm",
    external: ["coffeescript", "cson", "fire-keeper", "iconv-lite", "radash"],
  })
  .catch(() => process.exit(1));
