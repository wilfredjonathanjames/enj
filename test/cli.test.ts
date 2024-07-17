import { execSync } from "node:child_process"
import path from "node:path"
import { expect, inject, test } from "vitest"

test("CLI with default rootDir", () => {
  const testDir = path.join(inject("ZLIS_DIR"), "cwd_config")
  process.chdir(testDir)
  const output = execSync(`${inject("CMD")} command_one test this --option`, {
    encoding: "utf-8",
  })

  expect(output).toEqual("CALLED WITH test this { option: true }\n")
})

test("CLI with auto project root discovery", () => {
  const testDir = path.join(inject("ZLIS_DIR"), "cwd_config/zli/")
  process.chdir(testDir)
  const output = execSync(`${inject("CMD")} command_one test this --option`, {
    encoding: "utf-8",
  })

  expect(output).toEqual("CALLED WITH test this { option: true }\n")
})

test("CLI with arg configuration", () => {
  const testDir = path.join(inject("ZLIS_DIR"), "arg_config")
  const cmd = path.join(testDir, "cli.ts")
  const output = execSync(`${cmd} command`, {
    encoding: "utf-8",
  })
  expect(output).toEqual("ARG_CONFIG ROOTDIR WORKING\n")
})

test("CLI with file configuration", () => {
  const testDir = path.join(inject("ZLIS_DIR"), "file_config")
  const cmd = path.join(testDir, "cli.ts")
  const output = execSync(`${cmd} command`, {
    encoding: "utf-8",
  })
  expect(output).toEqual("FILE_CONFIG ROOTDIR WORKING\n")
})

test("CLI with env ZLI_ROOT_DIR configuration", () => {
  const rootDir = path.join(inject("ZLIS_DIR"), "arg_config/arg_commands")
  const output = execSync(`ZLI_ROOT_DIR=${rootDir} ${inject("CMD")} command`, {
    encoding: "utf-8",
  })
  expect(output).toEqual("ARG_CONFIG ROOTDIR WORKING\n")
})

test("CLI with env ZLI_CONFIG_FILE configuration", () => {
  const configFile = path.join(inject("ZLIS_DIR"), "file_config/.zlirc.json")
  const output = execSync(
    `ZLI_CONFIG_FILE=${configFile} ${inject("CMD")} command`,
    {
      encoding: "utf-8",
    },
  )
  expect(output).toEqual("FILE_CONFIG ROOTDIR WORKING\n")
})
