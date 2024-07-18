import { run } from "./build/index.mjs"
;(async () => {
  run({}, { configFileSearchFromCallsite: false })
})()

