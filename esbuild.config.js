import esbuild from 'esbuild'
import pkg from './package.json' with { type: 'json' }

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: false,
  outfile: 'dist/index.js',
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
  external: ['coffeescript', 'fire-keeper', 'iconv-lite', 'radash'],
})
