import { executeCall, findCommand, getCommandTree } from "./utils"

async function run(rootDir: string) {
  const args = process.argv.slice(2)
  const commandTree = await getCommandTree(rootDir)
  const call = findCommand(commandTree, args)
  executeCall(call)
}

export { run }
