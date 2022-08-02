import { nodeResolve } from "@rollup/plugin-node-resolve"

export default {
  input: "main.js",
  inlineDynamicImports: true,
  output: {
    file: "app/bundle.js",
    format: "iife"
  },
  plugins: [nodeResolve()]
}
