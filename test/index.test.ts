import path from "node:path"
import { execSync } from "node:child_process"
import { expect, test } from "vitest"
import { getCommandTree } from "../src/utils"

const DIR = path.join(__dirname, "testCli")
const CMD = path.join(DIR, "index.ts")

test("getCommandTree gets the correct file list", async () => {
  const expected = {
    root: {
      name: "",
      path: path.join(DIR),
      children: {
        command_one: {
          name: "command_one",
          path: path.join(DIR, "command_one"),
          children: {},
        },
        command_two: {
          name: "command_two",
          path: path.join(DIR, "command_two"),
          children: {
            command_three: {
              name: "command_three",
              path: path.join(DIR, "command_two", "command_three"),
              children: {},
            },
          },
        },
      },
    },
  }

  const commandTree = await getCommandTree(DIR)

  expect(commandTree).toEqual(expected)
})

test("shows help menu when called with no commands", () => {
  const output_ = execSync(CMD, {
    encoding: "utf-8",
  })

  console.log(output_)
})
