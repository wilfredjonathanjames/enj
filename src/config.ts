import path from "node:path"
import { packageDirectorySync } from "pkg-dir"
import callerCallsite from "caller-callsite"
import { cosmiconfig } from "cosmiconfig"
import { z } from "zod"
import { getProgramName } from "src/lib"

export const Config = z.object({
  configFile: z.string(),
  rootDir: z.string(),
})
export type Config = z.infer<typeof Config>
export type ArgConfig = Partial<Config>

type InitConfigOptions = {
  configFileSearchFromCallsite: boolean
}

let config: null | Config = null

export async function initConfig(
  argConfig: ArgConfig = {},
  { configFileSearchFromCallsite }: InitConfigOptions = {
    configFileSearchFromCallsite: true,
  },
) {
  const cwd = process.cwd()
  const callsiteDir = path.dirname(callerCallsite()?.getFileName() || cwd)
  const programName: string = getProgramName()
  const searchPlaces = [
    "package.json",
    `.${programName}rc`,
    `.${programName}rc.json`,
    `.${programName}rc.yaml`,
    `.${programName}rc.yml`,
    `.${programName}rc.js`,
    `.${programName}rc.ts`,
    `.${programName}rc.mjs`,
    `.${programName}rc.cjs`,
    `${programName}.config.json`,
    `${programName}.config.yaml`,
    `${programName}.config.yml`,
    `${programName}.config.js`,
    `${programName}.config.ts`,
    `${programName}.config.mjs`,
    `${programName}.config.cjs`,
    `.config/${programName}rc`,
    `.config/${programName}rc.json`,
    `.config/${programName}rc.yaml`,
    `.config/${programName}rc.yml`,
    `.config/${programName}rc.js`,
    `.config/${programName}rc.ts`,
    `.config/${programName}rc.mjs`,
    `.config/${programName}rc.cjs`,
  ]

  const envConfig = {
    configFile: process.env["ENJ_CONFIG_FILE"],
    rootDir: process.env["ENJ_ROOT_DIR"],
  }
  const fileConfig = {}
  const fallbackDir =
    envConfig.rootDir ?? argConfig.rootDir ?? packageDirectorySync() ?? cwd

  // ensure paths are absolute
  ensureAbsolute(envConfig, "rootDir", cwd)
  ensureAbsolute(envConfig, "configFile", cwd)
  ensureAbsolute(argConfig, "rootDir", callsiteDir)
  ensureAbsolute(argConfig, "configFile", callsiteDir)

  let configFile
  if (envConfig.configFile) {
    configFile = envConfig.configFile
  } else if (argConfig.configFile) {
    configFile = argConfig.configFile
  }

  // get file config
  const explorer = cosmiconfig(programName, {
    searchPlaces,
    searchStrategy: "global",
  })
  let fileConfigResult
  if (configFile != null) {
    fileConfigResult = await explorer.load(configFile)
  } else {
    const configSearchStartDir = configFileSearchFromCallsite
      ? callsiteDir
      : fallbackDir
    fileConfigResult = await explorer.search(configSearchStartDir)
  }
  if (fileConfigResult != null) {
    const { config, filepath } = fileConfigResult
    configFile = filepath
    Object.assign(fileConfig, config)
    const configDir = path.dirname(filepath)
    ensureAbsolute(fileConfig, "rootDir", configDir)
    ensureAbsolute(fileConfig, "configFile", configDir)
  }

  const newConfig = mergeDefined(
    { rootDir: path.join(fallbackDir, programName), configFile: "" },
    argConfig,
    fileConfig,
    envConfig,
    {
      configFile,
    },
  )

  config = Config.parse(newConfig)
}

export default async function getConfig(): Promise<Config> {
  if (config == null) throw new Error("Config not initialised.")
  return config
}

function ensureAbsolute(
  object: Record<string, any>,
  key: string,
  root: string,
) {
  if (object[key] == null || typeof object[key] !== "string") {
    return
  }
  if (!path.isAbsolute(object[key])) {
    object[key] = path.join(root, object[key])
  }
}

function mergeDefined(
  target: Record<string, any>,
  ...args: Record<string, any>[]
) {
  for (const source of args) {
    for (const key in source) {
      const value = source[key]
      if (value != null) {
        target[key] = value
      }
    }
  }
  return target
}
