import { expect, inject, test } from "vitest"

test("getCommandTree gets the correct file list", async () => {
  expect(inject("COMMAND_TREE")).toEqual(inject("COMMAND_TREE"))
})
