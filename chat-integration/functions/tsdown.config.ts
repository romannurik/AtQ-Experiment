import { defineConfig } from "tsdown";

export default defineConfig({
  format: ["cjs"],
  target: ["es2022"],
  envFile: ".env",
  clean: true,
  minify: false,
  outDir: "lib",
  fixedExtension: false,
  entry: ["./src/index.ts"],
  platform: "node",
});
