import { execSync } from 'node:child_process'
import { expect, test } from "vitest"

const CMD = `${__dirname}/testCli/index.ts`

test("shows help menu when called with no commands", () => {
  const output_ = execSync(`${CMD}`, {
    encoding: "utf-8",
  })

  console.log(output_)
})

