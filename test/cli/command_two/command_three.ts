import { Cmd } from "src/types"

export default async function (cmd: Cmd) {
  return cmd.description("The third command.").action(() => {
    console.log("COMMAND THREE")
  })
}
