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
@delphai/cli/0.0.0 linux-x64 node-v10.24.0
$ delphai --help [COMMAND]
USAGE
  $ delphai COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`delphai ctx [CONTEXT]`](#delphai-ctx-context)
* [`delphai envoy`](#delphai-envoy)
* [`delphai init PROJECT`](#delphai-init-project)
* [`delphai secrets`](#delphai-secrets)
* [`delphai sync`](#delphai-sync)

## `delphai ctx [CONTEXT]`

change the delphai context

```
USAGE
  $ delphai ctx [CONTEXT]

OPTIONS
  -c, --cluster=cluster  kubernetes cluster to connect to
```

_See code: [build/commands/ctx.ts](https://github.com/delphai/delphai-cli/blob/v0.0.0/build/commands/ctx.ts)_

## `delphai envoy`

generate envoy config for grpc-web

```
USAGE
  $ delphai envoy
```

_See code: [build/commands/envoy.ts](https://github.com/delphai/delphai-cli/blob/v0.0.0/build/commands/envoy.ts)_

## `delphai init PROJECT`

create a new project

```
USAGE
  $ delphai init PROJECT

OPTIONS
  -l, --language=python|typescript|react  project language
```

_See code: [build/commands/init.ts](https://github.com/delphai/delphai-cli/blob/v0.0.0/build/commands/init.ts)_

## `delphai secrets`

get kubernetes secrets

```
USAGE
  $ delphai secrets

OPTIONS
  -n, --namespace=namespace  [default: default]
```

_See code: [build/commands/secrets.ts](https://github.com/delphai/delphai-cli/blob/v0.0.0/build/commands/secrets.ts)_

## `delphai sync`

sync the project with the latest template

```
USAGE
  $ delphai sync

OPTIONS
  -d, --cwd=cwd  [default: /home/barath/Development/projects/skunkworks/delphai-cli] working directory
```

_See code: [build/commands/sync.ts](https://github.com/delphai/delphai-cli/blob/v0.0.0/build/commands/sync.ts)_
<!-- commandsstop -->
