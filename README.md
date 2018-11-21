Fillet [WIP]
======

CLI tools for Stripe 

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@hideokamoto/fillet.svg)](https://www.npmjs.com/package/@hideokamoto/fillet)
[![CircleCI](https://circleci.com/gh/hideokamoto/fillet/tree/master.svg?style=shield)](https://circleci.com/gh/hideokamoto/fillet/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/fillet.svg)](https://npmjs.org/package/@hideokamoto/fillet)
[![License](https://img.shields.io/npm/l/@hideokamoto/fillet.svg)](https://github.com/hideokamoto/fillet/blob/master/package.json)

<!-- toc -->
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Getting Started

```sh-session
$ npm i -g @hideokamoto/fillet

$ fillet init {STRIPE_SK_KEY}
$ fillet COMMAND
```

# Usage
<!-- usage -->
```sh-session
$ npm install -g @hideokamoto/fillet
$ fillet COMMAND
running command...
$ fillet (-v|--version|version)
@hideokamoto/fillet/0.0.0 darwin-x64 node-v10.1.0
$ fillet --help [COMMAND]
USAGE
  $ fillet COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fillet billing TYPE`](#fillet-billing-type)
* [`fillet help [COMMAND]`](#fillet-help-command)
* [`fillet init STRIPE`](#fillet-init-stripe)

## `fillet billing TYPE`

Stripe Billing

```
USAGE
  $ fillet billing TYPE

ARGUMENTS
  TYPE  products, subscriptions

OPTIONS
  -f, --force              Should replace plan or products
  -h, --help               show CLI help
  -n, --fileName=fileName
  -o, --output
  -v, --verbose            debug mode

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

## `fillet init STRIPE`

Initialize fillet

```
USAGE
  $ fillet init STRIPE

ARGUMENTS
  STRIPE  Stripe secret key

OPTIONS
  -h, --help  show CLI help

DESCRIPTION
  ...
  To put Stripe secret key into .fillet/config
  The file will be ignored from git.
```

_See code: [src/commands/init.js](https://github.com/hideokamoto/fillet/blob/v0.0.0/src/commands/init.js)_
<!-- commandsstop -->

## `fillet billing TYPE`

Stripe Billing

```
USAGE
  $ fillet billing TYPE

ARGUMENTS
  TYPE  products, subscriptions

OPTIONS
  -f, --force              Should replace plan or products
  -h, --help               show CLI help
  -n, --fileName=fileName
  -o, --output
  -v, --verbose            debug mode

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/billing.js](https://github.com/hideokamoto/fillet/blob/v0.0.0/src/commands/billing.js)_

### Product / Plan object
You can define your plan as YAML file.

```
name: example plan
type: service
active: true
statement_descriptor: hello fillet
plans:
  - id: my-plan
    currency: jpy
    interval: month
    nickname: My Plan
    active: true
    amount: 15000
id: prod_XXXXXXXXXXXXX
```

#### Create / Update a plan

```
$ fillet billing import-product -n ./product.yml
Import product:: prod_XXXXXXXXXXXXX
plan created:my-plan
Finished
```

You **can not** update price / interval / currency to exists plan.

```
$ fillet billing import-product -n ./product.yml
Import product:: prod_XXXXXXXXXXXXX
plan: my-plan has been skipped.
If you replace the plan, please run the command with -f / --force option
Finished
```


#### Upgrade plan price
You can use `-f` option to replace plan price.
**-f option will delete / create plan***

```
$ fillet billing import-product -n ./product.yml -f
Import product:: prod_XXXXXXXXXXXXX
[Replace]: my-plan
[Replace]:starting to delete my-plan
plan deleted:my-plan
[Replace]:starting to create new plan
plan created:my-plan
[Replace]:replace new plan: my-plan
Finished
```

### Check plan diff

You can check your plan diff between Stripe to your local YAML file.

```
$ fillet billing diff-plans -n ./product.yml
  [
  {
    "active": true,
-     "amount": 10000,
+     "amount": 15000,
      "currency": "jpy",
    "id": "my-plan",
    "interval": "month",
-     "interval_count": 1,
-
      "nickname": "テスト",
-     "object": "plan",
-
      "product": "prod_XXXXXXXXXXXXX",
    }
]
```


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


