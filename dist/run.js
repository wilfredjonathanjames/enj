;(async () => {
  const { run } = await import("./build/index.js")
  run({}, { configFileSearchFromCallsite: false })
})()
