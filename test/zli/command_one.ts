import { Cmd } from "src/types"

export default async function (cmd: Cmd) {
  return cmd
    .description("the first command")
    .argument("<firstArg>", "firstArg")
    .argument("<secondArg>", "secondArg")
    .option("--option", "option")
    .action((firstArg, secondArg, opts) => {
      console.log("CALLED WITH", firstArg, secondArg, opts)
    })
}
