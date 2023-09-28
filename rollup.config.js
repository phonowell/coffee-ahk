import autoExternal from 'rollup-plugin-auto-external'
import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-ts'
import { terser } from 'rollup-plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'

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
      resolve(),
      json(),
      commonjs(),
      typescript(),
      terser(),
      visualizer(),
    ],
  },
]

export default config
