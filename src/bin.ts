#!/usr/bin/env npx tsx

import { run } from "src"
import { getRootDir } from "src/utils"
;(async () => {
  const rootDir = await getRootDir()
  run(rootDir)
})()
