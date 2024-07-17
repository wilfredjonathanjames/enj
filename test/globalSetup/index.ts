import path from "node:path"
import { CommandTree } from "src/types"
import { getCommandTree } from "src/lib"
import type { GlobalSetupContext } from "vitest/node"

const DIR = path.join(__dirname, "..", "zlis/cwd_config/zli/")
const CMD = path.resolve(__dirname, "../../src/bin.ts")
const ZLIS_DIR = path.join(__dirname, "..", "zlis")

const EXPECTED_COMMAND_TREE: CommandTree = {
  root: {
    name: "zli",
    path: path.join(DIR),
    children: {
      command_one: {
        name: "command_one",
        path: path.join(DIR, "command_one"),
        children: {},
      },
      command_two: {
        name: "command_two",
        path: path.join(DIR, "command_two"),
        children: {
          command_three: {
            name: "command_three",
            path: path.join(DIR, "command_two", "command_three"),
            children: {},
          },
        },
      },
    },
  },
}

export default async function setup({ provide }: GlobalSetupContext) {
  const commandTree = await getCommandTree(DIR, { noCmd: true })
  provide("CMD", CMD)
  provide("ZLIS_DIR", ZLIS_DIR)
  provide("COMMAND_TREE", commandTree)
  provide("EXPECTED_COMMAND_TREE", EXPECTED_COMMAND_TREE)
}

declare module "vitest" {
  export interface ProvidedContext {
    CMD: string
    ZLIS_DIR: string
    COMMAND_TREE: CommandTree
    EXPECTED_COMMAND_TREE: CommandTree
  }
}
