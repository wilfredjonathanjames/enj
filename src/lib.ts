import path from "node:path"
import { existsSync } from "node:fs"
import { glob } from "glob"
import { packageDirectorySync } from "pkg-dir"
import { Command } from "@commander-js/extra-typings"
import { Call, Cmd, CommandTree, CommandTreeNode, RawArgs } from "src/types"
import getConfig from "src/config"

export function getProgramName() {
  return "enj"
}

type GetCommandTreeOptions = {
  noCmd: boolean
}
export async function getCommandTree(
  commandDir: string,
  { noCmd }: GetCommandTreeOptions = { noCmd: false },
) {
  const globPath = path.join(commandDir, "**/[^_]*.{js,ts}{,/**}")
  const files_ = await glob(globPath)
  const programName = getProgramName()

  const fileTree = files_.reduce(
    (acc, filepath) => {
      const simplePath = filepath
        .replace(commandDir, "")
        .replace(/^\//g, "")
        .replace(/\.(js|ts)$/, "")
      const pathTreeArray = simplePath.split("/")
      if (pathTreeArray[pathTreeArray.length - 1] === "index") {
        pathTreeArray.pop()
      }

      let node: CommandTreeNode = acc.root
      if (simplePath === "index") {
        node.path = filepath
      }
      pathTreeArray.forEach((segment) => {
        if (node.children[segment] == null) {
          const cmd = new Command().name(segment)
          node.children[segment] = {
            name: segment,
            path: filepath,
            children: {},
          }
          if (!noCmd) {
            node.cmd?.addCommand(cmd)
            node.children[segment].cmd = cmd
          }
        }
        node = node.children[segment]
      })

      return acc
    },
    {
      root: {
        name: programName,
        path: null,
        cmd: noCmd ? undefined : new Command().name(programName),
        children: {},
      },
    } as CommandTree,
  )
  return fileTree
}

export function findCommand(commandTree: CommandTree, args_: RawArgs): Call {
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

export async function loadCommand(command: CommandTreeNode) {
  let cmdBuilder = defaultCmdBuilder
  if (command.path != null) {
    try {
      let { default: cmdBuilder_ } = await import(command.path)
      // handle edgecase module convesions lead to nested defaults
      if (cmdBuilder_.default) {
        cmdBuilder_ = cmdBuilder_.default
      }
      if (cmdBuilder_ instanceof Function) {
        cmdBuilder = cmdBuilder_
      }
    } catch (e: any) {
      console.error(e)
      const { rootDir } = await getConfig()
      if (command.path !== rootDir) {
        console.log(
          `Missing command definition ${path.join(command.path, "index.{js|ts}")}`,
        )
      }
    }
  }
  const cmd = await cmdBuilder(command.cmd!)
  cmd.name(command.name)
  return cmd
}

export async function executeCall({ command, args: args }: Call) {
  const cmd = await loadCommand(command)
  await cmd.parseAsync(args, { from: "user" })
}

async function defaultCmdBuilder(cmd?: Cmd) {
  return cmd || new Command()
}
