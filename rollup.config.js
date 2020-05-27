import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const name = /[a-z\-]+$/i.exec(pkg.name)[0];

export default {
  input: './src/index.ts',

  output: [
    {
      exports: 'named',
      file: pkg.main,
      format: 'commonjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    },
    {
      file: pkg.browser,
      format: 'esm',
      plugins: [
        getBabelOutputPlugin({
          presets: [
            [
              '@babel/preset-env',
              {
                bugfixes: true,
                forceAllTransforms: true,
                loose: true,
                modules: 'umd',
                targets: '> 0.25%, not dead'
              }
            ]
          ],
          // Sets the global name used for the UMD export
          filename: name
        })
      ]
    }
  ],

  external: [],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({ babelHelpers: 'bundled', extensions, include: ['src/**/*'] })
  ]
};
