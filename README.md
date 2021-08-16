@ionos-cloud/ionossdk
===================

Ionos Cloud SDK generator

[![Version](https://img.shields.io/npm/v/@ionos-cloud/ionossdk.svg)](https://npmjs.org/package/@ionos-cloud/ionossdk)
[![License](https://img.shields.io/npm/l/@ionos-cloud/ionossdk.svg)](https://github.com/ionos-cloud/ionossdk/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @ionos-cloud/ionossdk
$ ionossdk COMMAND
running command...
$ ionossdk (-v|--version|version)
@ionos-cloud/ionossdk/1.1.0 darwin-x64 node-v16.0.0
$ ionossdk --help [COMMAND]
USAGE
  $ ionossdk COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ionossdk cache OPERATION`](#ionossdk-cache-operation)
* [`ionossdk generate`](#ionossdk-generate)
* [`ionossdk help [COMMAND]`](#ionossdk-help-command)

## `ionossdk cache OPERATION`

cache management

```
USAGE
  $ ionossdk cache OPERATION

ARGUMENTS
  OPERATION  (clear|info) cache operation to perform

OPTIONS
  -d, --debug  show debug information
  -h, --help   show CLI help
```

_See code: [src/commands/cache.ts](https://github.com/ionos-cloud/ionossdk/blob/v1.1.0/src/commands/cache.ts)_

## `ionossdk generate`

Generates an Ionos Cloud SDK

```
USAGE
  $ ionossdk generate

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

_See code: [src/commands/generate.ts](https://github.com/ionos-cloud/ionossdk/blob/v1.1.0/src/commands/generate.ts)_

## `ionossdk help [COMMAND]`

display help for ionossdk

```
USAGE
  $ ionossdk help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
