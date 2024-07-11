export type Command = {
  name: string
  description: string
  args: string[]
  action: () => void
}

export type CommandTreeNode = {
  command: Command
  children: Command[]
}
