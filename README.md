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
$ npm install -g @ionos-cloud/sdk
$ sdk COMMAND
running command...
$ sdk (-v|--version|version)
@ionos-cloud/sdk/1.0.2 darwin-x64 node-v16.0.0
$ sdk --help [COMMAND]
USAGE
  $ sdk COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`sdk cache OPERATION`](#sdk-cache-operation)
* [`sdk generate`](#sdk-generate)
* [`sdk help [COMMAND]`](#sdk-help-command)

## `sdk cache OPERATION`

describe the command here

```
USAGE
  $ sdk cache OPERATION

ARGUMENTS
  OPERATION  (clear|info) cache operation to perform

OPTIONS
  -d, --debug  show debug information
  -h, --help   show CLI help
```

_See code: [src/commands/cache.ts](https://github.com/ionos-cloud/sdk/blob/v1.0.2/src/commands/cache.ts)_

## `sdk generate`

Generates an Ionos Cloud SDK

```
USAGE
  $ sdk generate

OPTIONS
  -a, --assets-dir=assets-dir  sdk assets directory (templates, scripts etc)
  -b, --build                  also build the sdk with the build.sh script
  -c, --no-cache               don't use the cache
  -d, --debug                  show debug information
  -h, --help                   show CLI help
  -n, --name=name              (required) sdk to build
  -o, --output-dir=output-dir  output dir
  -s, --spec=spec              (required) api spec
  -v, --version=version        (required) sdk version
```

_See code: [src/commands/generate.ts](https://github.com/ionos-cloud/sdk/blob/v1.0.2/src/commands/generate.ts)_

## `sdk help [COMMAND]`

display help for sdk

```
USAGE
  $ sdk help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
