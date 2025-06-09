import autoExternal from 'rollup-plugin-auto-external'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-ts'
import { terser } from 'rollup-plugin-terser'

const config = [
  {
    input: { index: 'src/index.ts' },
    output: [
      {
        exports: 'named',
        dir: 'dist',
        format: 'esm',
      },
    ],
    plugins: [
      autoExternal(),
      resolve(),
      json(),
      typescript(),
      commonjs(),
      terser(),
    ],
  },
]

export default config
