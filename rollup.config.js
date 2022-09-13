import autoExternal from 'rollup-plugin-auto-external'
import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
import filesize from 'rollup-plugin-filesize'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

const config = [
  {
    input: { index: 'source/index.ts' },
    output: [
      {
        exports: 'named',
        dir: 'dist',
        format: 'cjs',
      },
    ],
    plugins: [
      del({ targets: 'dist' }),
      autoExternal(),
      json(),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'esnext',
            target: 'es5',
          },
        },
      }),
      resolve(),
      commonjs(),
      filesize(),
    ],
  },
]

export default config