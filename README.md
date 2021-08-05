@ionos-cloud/sdkgen
===================

Ionos Cloud SDK generator

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ionos-cloud/sdkgen.svg)](https://npmjs.org/package/@ionos-cloud/sdkgen)
[![Downloads/week](https://img.shields.io/npm/dw/@ionos-cloud/sdkgen.svg)](https://npmjs.org/package/@ionos-cloud/sdkgen)
[![License](https://img.shields.io/npm/l/@ionos-cloud/sdkgen.svg)](https://github.com/ionos-cloud/sdkgen/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @ionos-cloud/sdkgen
$ sdkgen COMMAND
running command...
$ sdkgen (-v|--version|version)
@ionos-cloud/sdkgen/0.0.1 darwin-x64 node-v16.0.0
$ sdkgen --help [COMMAND]
USAGE
  $ sdkgen COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`sdkgen hello [FILE]`](#sdkgen-hello-file)
* [`sdkgen help [COMMAND]`](#sdkgen-help-command)

## `sdkgen hello [FILE]`

describe the command here

```
USAGE
  $ sdkgen hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ sdkgen hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/ionos-cloud/sdkgen/blob/v0.0.1/src/commands/hello.ts)_

## `sdkgen help [COMMAND]`

display help for sdkgen

```
USAGE
  $ sdkgen help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
