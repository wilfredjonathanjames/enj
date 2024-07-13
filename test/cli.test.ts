import { execSync } from "node:child_process"
import { expect, inject, test } from "vitest"

test("CLI calls command_one with args", () => {
  const output = execSync(`${inject("CMD")} command_one test this`, {
    encoding: "utf-8",
  })

  expect(output).toEqual("CALLED WITH [ 'test', 'this' ]\n")
})
