import { Command as Command_ } from "@commander-js/extra-typings"

export type Cmd = Command_

export type CommandTreeNode = {
  name: string
  path: string | null
  cmd?: Cmd
  children: {
    [key: string]: CommandTreeNode
  }
}
export type CommandTree = {
  root: CommandTreeNode
}

export type RawArgs = string[]

export type Call = {
  args: RawArgs
  command: CommandTreeNode
}
