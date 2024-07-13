import path from "node:path"
import { glob } from "glob"
import { Command, CommandTree, CommandTreeNode, RawArgs } from "src/types"

export async function getCommandTree(commandDir: string) {
  const globPath = path.join(commandDir, "**/[^_]*.ts{,/**}")
  const files_ = await glob(globPath)

  const fileTree = files_.reduce(
    (acc, filepath_) => {
      const pathTreeArray = filepath_
        .replace(commandDir + "/", "")
        .replace(/\.ts$/, "")
        .split("/")
        .filter((segment) => segment !== "index")

      let node = acc.root
      pathTreeArray.forEach((segment) => {
        if (node.children[segment] == null) {
          node.children[segment] = {
            name: segment,
            path: path.join(node.path, segment),
            children: {},
          }
        }
        node = node.children[segment]
      })

      return acc
    },
    {
      root: {
        name: "",
        path: commandDir,
        children: {},
      },
    } as CommandTree,
  )
  return fileTree
}

export function findCommand(commandTree: CommandTree, args_: RawArgs): Command {
  let command = commandTree.root
  let args = [...args_]
  for (const arg of args_) {
    if (command.children[arg] != null) {
      command = command.children[arg]
      args.shift()
    } else {
      break
    }
  }
  return {
    args,
    command,
  }
}

export function runCommand(command: Command) {}
