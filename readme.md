<div align="center">
	<div>
		<img width="450" height="450" src="media/logo.png" alt="ky">
	</div>
</div>

# Enj

> **Enj** - noun
> <br />(/ɛndʒ/)
>
> A powerful CLI framework wrapped in an intuitive file based router.

<br />

## Why

- Simple to start, simple to use
- Easy to iterate, easy to configure
- Clean, readable file structure
- Extraordinarily powerful command definitions

### Why not

- Doesn't support Windows yet

### Future
When I can prioritise it-
- [ ] Unironically rewrite in Rust or Zig, get execution time sub 10ms
- [ ] Enable writing commands in any executable language

## Quickstart

1. Create a directory in your project root called `enj`

2. Add a file to that directory called `hello-world.js` containing the following

   ##### ESM

   ```javascript
   // enj/hello-world.js
   export default (cmd) =>
     cmd.action(() => {
       console.log(`Hello World!`)
     })
   ```

   ##### CommonJS

   ```javascript
   // enj/hello-world.js
   module.exports = (cmd) =>
     cmd.action(() => {
       console.log(`Hello World!`)
     })
   ```

   ##### Typescript

   Enj also supports typescript with [one simple installation](#typescript-3).

   Make sure your file extension is `.ts`.

   ```typescript
   // enj/hello-world.ts
   import type { Cmd } from "enj"

   export default (cmd: Cmd) =>
     cmd.action(() => {
       console.log(`Hello World!`)
     })
   ```

3. Run the command with Enj

   ```bash
   npx enj hello-world
   # Hello World!
   ```

## Install

Enj can be installed globally or locally.

Install locally in team projects to ensure versions stay in sync.

#### Local

```
npm install --save-dev enj
```

#### Global

```
npm install --global enj
```

## Adding Commands

This file structure

```
enj
├── cowsay
│   ├── dragon.js
│   └── index.js
├── hello-world.js
├── _utils.js
└── index.js
```

Gives the following command structure

```
enj
enj cowsay
enj cowsay dragon
enj hello-world
```

Enj uses a file-based router to define the command structure.

To add the command `enj hello-world`, we add a file to the enj root directory called `hello-world.js`, or `hello-world.ts` if you're [using typescript](#typescript-3).

Directories are used to create subcommands. For instance adding the directory `cowsay/` and the file `cowsay/dragon.js`, we create the command `enj cowsay dragon`.

Enj respects `index.[js|ts]` files. You can add configure the `enj cowsay` command by adding the command file `cowsay/index.js`.

#### Ignoring files

Files and directories starting with `_` will be ignored by Enj.

#### Where to add command files

Unless it has been [reconfigured](#config), the Enj root directory is `<DIR>/enj`, where `DIR` is the nearest project root or the Current Working Directory.

### Writing command files

##### CommonJS

```javascript
module.exports = (cmd) =>
  cmd
    .argument("<name>", "Your name")
    .option("-e, --excite", "Be excited")
    .action((name, { excite }) => {
      const punctuation = excite ? "!" : "."
      console.log(`Hello ${name}${punctuation}`)
    })
```

##### ESM

```javascript
export default (cmd) =>
  cmd
    .argument("<name>", "Your name")
    .option("-e, --excite", "Be excited")
    .action((name, { excite }) => {
      const punctuation = excite ? "!" : "."
      console.log(`Hello ${name}${punctuation}`)
    })
```

##### Typescript

Make sure you are [using typescript](#typescript-3).

```typescript
import type { Cmd } from "enj"

export default (cmd: Cmd) =>
  cmd
    .argument("<name>", "Your name")
    .option("-e, --excite", "Be excited")
    .action((name, { excite }) => {
      const punctuation = excite ? "!" : "."
      console.log(`Hello ${name}${punctuation}`)
    })
```

As of `v0.0.x`, Enj uses [`commander.js`](https://github.com/tj/commander.js) for command definitions. This may change in future versions.

This means the `cmd` argument that is passed into Enj command files is a [commander `Command` object](https://github.com/tj/commander.js?tab=readme-ov-file#commands).

<sup><sub>_**NOTE:** Because of this, you have control over more than just the command
you are configuring in your command file. You could rename your command, add subcommands,
return a different command, alias your command to something else, and much more.
However this is **undefined behaviour** and **really possibly could break things**. Only
get freaky with it if you know what you're doing._</sub></sup>

#### `cmd` Examples

Full documentation of the `cmd` child methods can be found [here](https://www.jsdocs.io/package/commander#Command).

Some useful examples:

##### Options

```javascript
cmd
    .option("--long", "Long option")
    .option("-s", "Short option")
    .option("-b, --both", "Both long and short options")
    .option("-n, --no-description")
    .action(({ long, s, both, noDescription }) => { ... })
```

###### Option arguments

```javascript
cmd
    .option("-n, --no-arg", "No option-argument")
    .option("-r, --required-arg <VALUE>", "Required option-argument")
    .option("-o, --optional-arg [VALUE]", "Optional option-argument")
    .action(({ arg, requiredArg, optionalArg }) => { ... })
```

_Note that `no-arg` is inverted and becomes `arg` rather than `noArg`. Read more [here](https://github.com/tj/commander.js?tab=readme-ov-file#other-option-types-negatable-boolean-and-booleanvalue)._

###### Option argument defaults

```javascript
cmd
    .option("-r, --required-arg <VALUE>", "Required") // required args don't take defaults
    .option("-o, --optional-arg [VALUE]", "Optional with default", "default value")
    .action(({ optionalArg }) => { ... })
```

_Note that this only applies if the option is left out entirely. If it is used but empty, it will be `true`._

###### Option argument parsing

```javascript
cmd
    .option("-r, --required-arg <VALUE>", "Required", parseFloat)
    .option("-o, --optional-arg [VALUE]", "Optional with default", parseInt, 7)
    .action(({ requiredArg, optionalArg }) => { ... })
```

###### Option argument choices

```javascript
const { Option } = require("enj");
...

cmd
    .addOption(
        new Option("-c, --cheese [CHEESE]", "add extra cheese")
            .default("cheddar")
            .choices(["cheddar", "brie", "gouda", "parmesan"])
    )
    .action(({ cheese }) => { ... })
```

_Note for Typescript users: narrow the choices type by using `as const`:_

```
            ...
            .choices(["cheddar", "brie", "gouda", "parmesan"] as const)
            ...
```

##### Arguments

```javascript
  cmd
    .argument("<required>", "Required argument")
    .argument("[optional]", "Optional argument")
    .argument("[no-description]")
    .action((required, optional, noDescription) => { ... })
```

_Note that unlike options, arguments are given to the action
handler as separate arguments that precede the options object.
Read more [here](https://github.com/tj/commander.js?tab=readme-ov-file#action-handler)._

###### Argument defaults

```javascript
  cmd
    .argument("<required>", "Required argument") // required args don't take defaults
    .argument("[optional]", "Optional argument with default", "optional default")
    .action((required, optional) => { ... })
```

###### Argument parsing

```javascript
  cmd
    .argument("<required>", "Required argument", parseFloat)
    .argument("[optional]", "Optional argument", parseInt, 7)
    .action((required, optional) => { ... })
```

###### Argument choices

```javascript
const { Argument } = require("enj");
...

cmd
    .addArgument(
        new Argument("<size>", "Choose a size")
            .default("small")
            .choices([
                "small",
                "medium",
                "large",
            ]),
    )
    .action((size) => { ... })
```

_Note for Typescript users: narrow the choices type by using `as const`:_

```
            ...
            .choices([
                "small",
                "medium",
                "large",
            ] as const),
            ...
```

This is only scratching the surface.
Read the commander.js [examples](https://github.com/tj/commander.js/tree/master/examples) and [docs](https://github.com/tj/commander.js) for more.

## Config

Enj can be configured in all of three ways

- Environment variables
- [Run script](#run-script) args
- Config files

### Values

| Config                  | Default              | Environment varable | [Run script](#run-script) arg | Config file value |
| ----------------------- | -------------------- | ------------------- | ----------------------------- | ----------------- |
| Config file path        | Found dynamically    | `ENJ_CONFIG_FILE`   | `configFile`                  | N/A               |
| Commands root directory | `<PROJECT_ROOT>/enj` | `ENJ_ROOT_DIR`      | `rootDir`                     | `rootDir`         |

#### Relative paths

Paths can be absolute. If they are relative, Enj does it's best to resolve them to something sensible. This depends on the configuration method.

|                           | Environment varable       | [Run script](#run-script) arg | Config file value |
| ------------------------- | ------------------------- | ----------------------------- | ----------------- |
| Relative to the directory | The command was called in | Of the run script             | The config is in  |

#### Config files

##### Package.json

Add an `enj` object to your `package.json`:

```json
"enj": {
    "rootDir": "./commands"
},
```

##### Other config files

Supported config files are

```
.enjrc
.enjrc.[format]
enj.config.[format]
.config/enjrc
.config/enjrc.[format]
```

Supported formats are `json|yaml|yml|js|ts|mjs|cjs`

If no config file is defined explicitly, Enj will search for a config file all the way down to your home directory.

If you are using a custom run script to configure Enj, config search will start from the directory your script is in.

Otherwise it will fall back through the following locations:

1. Environment variable `ENJ_ROOT_DIR`
1. [Run script](#run-script) config `rootDir`
1. The nearest nodejs project root
1. The Current Working Directory

After arriving at your home directory, if no config files are found, the global configuration directory is also checked.
The search location is defined by [env-paths](https://github.com/sindresorhus/env-paths) (without suffix.)

This directory is searched for the following files:

```
config
config.[format]
```

## Invoking

### Commandline

If installed locally

```
npx enj -h
```

If installed globally

```
enj -h
```

### Run script

A custom CLI can be created with custom configuration.

Create a cli file and make it executable (use any name you like, `cli` is an example):

```bash
touch ./cli && chmod +x ./cli
```

##### CommonJS

```javascript
// ./cli
#! /usr/bin/env node

const { run } = require('enj')
run()
```

##### ESM

```javascript
// ./cli
#! /usr/bin/env node

import { run } from 'enj'
run()
```

##### Typescript

Make sure you are [using typescript](#typescript-3).

<sup><sub>**IMPORTANT:** Note the use of `npx tsx` instead of `node` in the [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>).\</sub></sup>

```typescript
// ./cli
#! /usr/bin/env npx tsx

import { run } from 'enj'
run()
```

##### Configuring

The `run()` function takes an optional [config object](#config):

```
run({
    rootDir: 'commands',
})
```

#### Usage

Run the script from the Commandline (if you called it something else, use that name.)

```bash
./cli -h
```

#### Why

Why use a run script? You may want to publish your own CLI, rename Enj locally, or
avoid using configuration files. These are all valid reasons to use a run script.

### Package.json

You can of course use a package.json script to call enj.

```
"scripts": {
    ...
    "hello": "enj hello-world",
    ...
},
```

## Typescript

Using typescript with Enj is as easy as installing `tsx` either globally or locally.

### Installation

```

npm install --save-dev tsx

```

### Usage

```typescript
// enj/hello-world.ts
import type { Cmd } from "enj"

export default (cmd: Cmd) =>
  cmd.action(() => {
    console.log("Hello World!")
  })
```

Enj still supports js files if you install tsx, so you can incrementally adopt typescript if necessary.

Enj also supports both ESM and CommonJS modules in JS, meaning you don't need to choose.
