import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const entry = './src/index.ts';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const packageName = /[a-z-]+$/i.exec(pkg.name)[0];

const externals = [
  ...Object.keys(pkg.dependencies ?? []),
  ...Object.keys(pkg.peerDependencies ?? [])
];

const commonPlugins = [
  // Allows node_modules resolution
  resolve({ extensions, mainFields: ['module', 'browser', 'main'] }),

  // Allow bundling cjs modules. Rollup doesn't understand cjs
  commonjs()
];

// Config for CommonJS and ES module outputs
const buildSystemConfig = {
  // Don't bundle packages marked as external
  external: externals,

  input: entry,

  output: [
    {
      exports: 'named',
      file: pkg.main,
      format: 'commonjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],

  plugins: [
    ...commonPlugins,

    // Compile TypeScript/JavaScript files
    babel({ babelHelpers: 'bundled', extensions, include: ['src/**/*'] })
  ]
};

// Config that should work in browsers
const browserConfig = {
  input: entry,

  output: {
    exports: 'named',
    file: pkg.browser,
    format: 'umd',
    globals: externals.reduce((globals, name) => {
      globals[name] = name;
      return globals;
    }, []),
    name: packageName,
    sourcemap: true
  },

  plugins: [
    ...commonPlugins,

    // Compile TypeScript/JavaScript files
    babel({
      babelHelpers: 'runtime',
      extensions,
      plugins: ['@babel/plugin-transform-runtime'],
      presets: [
        [
          '@babel/preset-env',
          {
            bugfixes: true,
            forceAllTransforms: true,
            loose: true,
            modules: false,
            targets: pkg.browserslist
          }
        ]
      ]
    }),

    terser()
  ]
};

export default [buildSystemConfig, browserConfig];
