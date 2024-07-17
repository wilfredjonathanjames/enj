import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

const config = defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globalSetup: ["./test/globalSetup/index.ts"],
  },
})

export default config
