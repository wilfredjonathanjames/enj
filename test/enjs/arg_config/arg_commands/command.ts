import { Cmd } from "src/types"

export default function (cmd: Cmd) {
  return cmd
    .description("A command on a argConfig configured enj.")
    .action(() => {
      console.log("ARG_CONFIG ROOTDIR WORKING")
    })
}
