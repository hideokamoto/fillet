Fillet [WIP]
======

CLI tools for Stripe 

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fillet.svg)](https://npmjs.org/package/fillet)
[![CircleCI](https://circleci.com/gh/hideokamoto/fillet/tree/master.svg?style=shield)](https://circleci.com/gh/hideokamoto/fillet/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/fillet.svg)](https://npmjs.org/package/fillet)
[![License](https://img.shields.io/npm/l/fillet.svg)](https://github.com/hideokamoto/fillet/blob/master/package.json)

<!-- toc -->
* [Getting Started](#gs)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Getting Started {#gs}

```sh-session
$ npm i -g fillet

# use direnv
$ vim .envrc
export STRIPE_SECRET='sk_test_XXXXXXX'
$ direnv allow
$ fillet COMMAND

# directory
$ STRIPE_SECRET='sk_test_XXXXXXX' fillet COMMAND
```

# Usage
<!-- usage -->
```sh-session
$ fillet COMMAND
running command...
$ fillet (-v|--version|version)
fillet/0.0.0 darwin-x64 node-v10.1.0
$ fillet --help [COMMAND]
USAGE
  $ fillet COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fillet billing`](#fillet-billing)
* [`fillet help [COMMAND]`](#fillet-help-command)

## `fillet billing`

Describe the command here

```
USAGE
  $ fillet billing

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/billing.js](https://github.com/hideokamoto/fillet/blob/v0.0.0/src/commands/billing.js)_

## `fillet help [COMMAND]`

display help for fillet

```
USAGE
  $ fillet help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.0/src/commands/help.ts)_
<!-- commandsstop -->
