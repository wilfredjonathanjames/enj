import { cosmiconfig } from "cosmiconfig"
import { packageDirectorySync } from "pkg-dir"
import { z } from "zod"
import path from "node:path"
import { getProgramName } from "src/lib"

export const Config = z.object({
  rootDir: z.string().default(() => {
    const nearestRoot = packageDirectorySync()
    if (nearestRoot) {
      return path.join(nearestRoot, getProgramName())
    }
    return process.cwd()
  }),
})
export type Config = z.infer<typeof Config>

let config: null | Config = null

export default async function getConfig(): Promise<Config> {
  if (config != null) return config

  const moduleName: string = getProgramName()
  const searchPlaces = [
    "package.json",
    `.${moduleName}rc`,
    `.${moduleName}rc.json`,
    `.${moduleName}rc.yaml`,
    `.${moduleName}rc.yml`,
    `.${moduleName}rc.js`,
    `.${moduleName}rc.ts`,
    `.${moduleName}rc.mjs`,
    `.${moduleName}rc.cjs`,
    `${moduleName}.config.json`,
    `${moduleName}.config.yaml`,
    `${moduleName}.config.yml`,
    `${moduleName}.config.js`,
    `${moduleName}.config.ts`,
    `${moduleName}.config.mjs`,
    `${moduleName}.config.cjs`,
    `.config/${moduleName}rc`,
    `.config/${moduleName}rc.json`,
    `.config/${moduleName}rc.yaml`,
    `.config/${moduleName}rc.yml`,
    `.config/${moduleName}rc.js`,
    `.config/${moduleName}rc.ts`,
    `.config/${moduleName}rc.mjs`,
    `.config/${moduleName}rc.cjs`,
  ]

  const nearestRoot = packageDirectorySync()

  const explorer = cosmiconfig(moduleName, { searchPlaces })
  const { config: config_, filepath: configFilePath } =
    (await explorer.search(nearestRoot)) ?? {}

  config = Config.parse(config_ ?? {})

  if (configFilePath && config.rootDir && !path.isAbsolute(config.rootDir)) {
    config.rootDir = path.join(path.dirname(configFilePath), config.rootDir)
  }

  return config
}
