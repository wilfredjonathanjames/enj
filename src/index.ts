import { findCommand, getCommandTree } from "./utils"

async function run(rootDir: string) {
  const args = process.argv.slice(2)
  const commandTree = await getCommandTree(rootDir)
  const command = findCommand(commandTree, args)
  console.log(command)
}

export { run }
