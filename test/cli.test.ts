import { execSync } from "node:child_process"
import { beforeAll, expect, inject, test } from "vitest"

beforeAll(() => {
  process.chdir(inject("TEST_DIR"))
})

test("CLI calls command_one with args", () => {
  const output = execSync(`${inject("CMD")} command_one test this --option`, {
    encoding: "utf-8",
  })

  expect(output).toEqual("CALLED WITH test this { option: true }\n")
})
