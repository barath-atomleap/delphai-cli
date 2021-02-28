@delphai/cli
============

delphai command line utilities

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@delphai/cli.svg)](https://npmjs.org/package/@delphai/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@delphai/cli.svg)](https://npmjs.org/package/@delphai/cli)
[![License](https://img.shields.io/npm/l/@delphai/cli.svg)](https://github.com/delphai/delphai-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @delphai/cli
$ delphai COMMAND
running command...
$ delphai (-v|--version|version)
@delphai/cli/0.0.0 linux-x64 node-v14.15.5
$ delphai --help [COMMAND]
USAGE
  $ delphai COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`delphai ctx [CONTEXT]`](#delphai-ctx-context)
* [`delphai help [COMMAND]`](#delphai-help-command)
* [`delphai secrets`](#delphai-secrets)

## `delphai ctx [CONTEXT]`

change the delphai context

```
USAGE
  $ delphai ctx [CONTEXT]

OPTIONS
  -c, --cluster=cluster  kubernetes cluster to connect to
```

_See code: [build/commands/ctx.ts](https://github.com/delphai/delphai-cli/blob/v0.0.0/build/commands/ctx.ts)_

## `delphai help [COMMAND]`

display help for delphai

```
USAGE
  $ delphai help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `delphai secrets`

get kubernetes secrets

```
USAGE
  $ delphai secrets

OPTIONS
  -n, --namespace=namespace  [default: default]
```

_See code: [build/commands/secrets.ts](https://github.com/delphai/delphai-cli/blob/v0.0.0/build/commands/secrets.ts)_
<!-- commandsstop -->
