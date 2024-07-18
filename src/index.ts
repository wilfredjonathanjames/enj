import { executeCall, findCommand, getCommandTree } from "src/lib"
import getConfig, { ArgConfig, initConfig } from "src/config"
export type { Cmd } from "src/types"
export { Option, Command, Argument } from "@commander-js/extra-typings"

type RunOptions = {
  configFileSearchFromCallsite: boolean
}
async function run(
  argConfig: ArgConfig = {},
  { configFileSearchFromCallsite }: RunOptions = {
    configFileSearchFromCallsite: true,
  },
) {
  const args = process.argv.slice(2)
  await initConfig(argConfig, { configFileSearchFromCallsite })
  const { rootDir } = await getConfig()
  const commandTree = await getCommandTree(rootDir)
  const call = findCommand(commandTree, args)
  await executeCall(call)
}

export { run }
