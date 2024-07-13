import path from "node:path"
import { execSync } from "node:child_process"
import { expect, test, beforeAll } from "vitest"
import { findCommand, getCommandTree } from "../src/utils"
import { CommandTree } from "src/types"

const DIR = path.join(__dirname, "testCli")
const CMD = path.join(DIR, "index.ts")

const EXPECTED_COMMAND_TREE: CommandTree = {
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
let COMMAND_TREE: CommandTree

beforeAll(async () => {
  COMMAND_TREE = await getCommandTree(DIR)
})

test("getCommandTree gets the correct file list", async () => {
  expect(COMMAND_TREE).toEqual(COMMAND_TREE)
})

test("findCommand returns correct result when first arg doesn't match a layer one command", async () => {
  const args = ["test", "command_one"]
  const command = findCommand(COMMAND_TREE, args)
  expect(command).toEqual({
    args,
    command: EXPECTED_COMMAND_TREE.root,
  })
})

test("findCommand returns correct result when first arg is a layer two command", async () => {
  const args = ["command_three"]
  const command = findCommand(COMMAND_TREE, args)
  expect(command).toEqual({
    args,
    command: EXPECTED_COMMAND_TREE.root,
  })
})

test("findCommand returns correct result when first arg is a layer one command", async () => {
  const args = ["command_one"]
  const command = findCommand(COMMAND_TREE, args)
  expect(command).toEqual({
    args: [],
    command: EXPECTED_COMMAND_TREE.root.children.command_one,
  })
})

test("findCommand returns correct result when first arg is a layer one command", async () => {
  const args = ["command_one"]
  const command = findCommand(COMMAND_TREE, args)
  expect(command).toEqual({
    args: [],
    command: EXPECTED_COMMAND_TREE.root.children.command_one,
  })
})

test("findCommand returns correct result when accessing a layer two command", async () => {
  const args = ["command_two", "command_three"]
  const command = findCommand(COMMAND_TREE, args)
  expect(command).toEqual({
    args: [],
    command:
      EXPECTED_COMMAND_TREE.root.children.command_two.children.command_three,
  })
})

test("CLI shows help menu when called with no commands", () => {
  const output_ = execSync(`${CMD} test this`, {
    encoding: "utf-8",
  })

  console.log(output_)
})
