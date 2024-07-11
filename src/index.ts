import { getCommandTree } from "./utils"

async function run(rootDir: string) {
  console.log("RUN", await getCommandTree(rootDir))
}

export { run }
