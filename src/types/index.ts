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
