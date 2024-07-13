import path from "node:path"
import { CommandTree } from "src/types"
import { getCommandTree } from "src/utils"
import type { GlobalSetupContext } from "vitest/node"

const DIR = path.join(__dirname, "..", "cli")
const CMD = path.join(DIR, "index.ts")

const EXPECTED_COMMAND_TREE: CommandTree = {
  root: {
    name: "",
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
  const commandTree = await getCommandTree(DIR)
  provide("DIR", DIR)
  provide("CMD", CMD)
  provide("COMMAND_TREE", commandTree)
  provide("EXPECTED_COMMAND_TREE", EXPECTED_COMMAND_TREE)
}

declare module "vitest" {
  export interface ProvidedContext {
    DIR: string
    CMD: string
    COMMAND_TREE: CommandTree
    EXPECTED_COMMAND_TREE: CommandTree
  }
}
