import { execSync } from "node:child_process"
import { expect, inject, test } from "vitest"

test("CLI shows help menu when called with no commands", () => {
  const output_ = execSync(`${inject("CMD")} test this`, {
    encoding: "utf-8",
  })
})
