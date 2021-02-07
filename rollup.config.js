import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'

export default {
  input: 'src/site/_includes/js/app.js',
  output: {
    dir: 'src/site/_includes/js/out',
    format: 'es', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
  },
  plugins: [
    svelte({
      emitCss: false,
    }),
    resolve(),
    commonjs(),
  ],
}
