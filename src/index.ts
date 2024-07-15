import { executeCall, findCommand, getCommandTree } from "src/lib"
import getConfig from "src/config"

async function run() {
  const args = process.argv.slice(2)
  const { rootDir } = await getConfig()
  const commandTree = await getCommandTree(rootDir)
  const call = findCommand(commandTree, args)
  await executeCall(call)
}

export { run }
