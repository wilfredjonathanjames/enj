import path from "node:path"
import { glob } from "glob"
import { CommandTree } from "src/types"

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
        path: commandDir,
        children: {},
      },
    } as CommandTree,
  )
  return fileTree
}
