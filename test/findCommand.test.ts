import { expect, test, inject } from "vitest"
import { findCommand } from "../src/lib"

test("findCommand returns correct result when first arg doesn't match a layer one command", async () => {
  const args = ["test", "command_one"]
  const command = findCommand(inject("COMMAND_TREE"), args)
  expect(command).toEqual({
    args,
    command: inject("EXPECTED_COMMAND_TREE").root,
  })
})

test("findCommand returns correct result when first arg is a layer two command", async () => {
  const args = ["command_three"]
  const command = findCommand(inject("COMMAND_TREE"), args)
  expect(command).toEqual({
    args,
    command: inject("EXPECTED_COMMAND_TREE").root,
  })
})

test("findCommand returns correct result when first arg is a layer one command", async () => {
  const args = ["command_one"]
  const command = findCommand(inject("COMMAND_TREE"), args)
  expect(command).toEqual({
    args: [],
    command: inject("EXPECTED_COMMAND_TREE").root.children.command_one,
  })
})

test("findCommand returns correct result when accessing a layer two command", async () => {
  const args = ["command_two", "command_three"]
  const command = findCommand(inject("COMMAND_TREE"), args)
  expect(command).toEqual({
    args: [],
    command: inject("EXPECTED_COMMAND_TREE").root.children.command_two.children
      .command_three,
  })
})
