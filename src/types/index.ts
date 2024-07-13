export type CommandTreeNode = {
  name: string
  path: string
  children: {
    [key: string]: CommandTreeNode
  }
}
export type CommandTree = {
  root: CommandTreeNode
}

export type RawArgs = string[]
export type Args = any[]

export type Call = {
  args: RawArgs
  command: CommandTreeNode
}
