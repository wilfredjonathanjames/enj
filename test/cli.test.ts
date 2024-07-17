import { execSync } from "node:child_process"
import path from "node:path"
import { expect, inject, test } from "vitest"

test("CLI with default rootDir", () => {
  const testDir = path.join(inject("ENJS_DIR"), "cwd_config")
  process.chdir(testDir)
  const output = execSync(`${inject("CMD")} command_one test this --option`, {
    encoding: "utf-8",
  })

  expect(output).toEqual("CALLED WITH test this { option: true }\n")
})

test("CLI with auto project root discovery", () => {
  const testDir = path.join(inject("ENJS_DIR"), "cwd_config/enj/")
  process.chdir(testDir)
  const output = execSync(`${inject("CMD")} command_one test this --option`, {
    encoding: "utf-8",
  })

  expect(output).toEqual("CALLED WITH test this { option: true }\n")
})

test("CLI with arg configuration", () => {
  const testDir = path.join(inject("ENJS_DIR"), "arg_config")
  const cmd = path.join(testDir, "cli.ts")
  const output = execSync(`${cmd} command`, {
    encoding: "utf-8",
  })
  expect(output).toEqual("ARG_CONFIG ROOTDIR WORKING\n")
})

test("CLI with file configuration", () => {
  const testDir = path.join(inject("ENJS_DIR"), "file_config")
  const cmd = path.join(testDir, "cli.ts")
  const output = execSync(`${cmd} command`, {
    encoding: "utf-8",
  })
  expect(output).toEqual("FILE_CONFIG ROOTDIR WORKING\n")
})

test("CLI with env ENJ_ROOT_DIR configuration", () => {
  const rootDir = path.join(inject("ENJS_DIR"), "arg_config/arg_commands")
  const output = execSync(`ENJ_ROOT_DIR=${rootDir} ${inject("CMD")} command`, {
    encoding: "utf-8",
  })
  expect(output).toEqual("ARG_CONFIG ROOTDIR WORKING\n")
})

test("CLI with env ENJ_CONFIG_FILE configuration", () => {
  const configFile = path.join(inject("ENJS_DIR"), "file_config/.enjrc.json")
  const output = execSync(
    `ENJ_CONFIG_FILE=${configFile} ${inject("CMD")} command`,
    {
      encoding: "utf-8",
    },
  )
  expect(output).toEqual("FILE_CONFIG ROOTDIR WORKING\n")
})
