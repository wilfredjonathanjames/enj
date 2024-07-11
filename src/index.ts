import { CommandTreeNode } from "src/types"

function run(rootDir: string) {
  console.log("RUN", getCommandTreeNode(rootDir))
}

function getCommandTreeNode(rootDir: string): CommandTreeNode {
  return {
    command: {
      name: "test",
      description: "test command",
      args: ["test"],
      action: () => {
        console.log("TEST COMMAND")
      },
    },
    children: [],
  }
}

export { run }
