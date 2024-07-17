import { Cmd } from "src/types"

export default async function (cmd: Cmd) {
  return cmd.description("The second command.").action(() => {
    console.log("COMMAND TWO")
  })
}
