import { Cmd } from "src/types"

export default function (cmd: Cmd) {
  return cmd
    .description("A command on a fileConfig configured enj.")
    .action(() => {
      console.log("FILE_CONFIG ROOTDIR WORKING")
    })
}
