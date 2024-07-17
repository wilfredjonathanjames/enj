import { expect, inject, test } from "vitest"

test("globalSetup has actually defined the provider variables", async () => {
  expect(inject("CMD")).toBeDefined()
  expect(inject("ZLIS_DIR")).toBeDefined()
  expect(inject("COMMAND_TREE")).toBeDefined()
  expect(inject("EXPECTED_COMMAND_TREE")).toBeDefined()
})
