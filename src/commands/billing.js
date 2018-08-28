const {Command, flags} = require('@oclif/command')
const chalk = require('chalk')

class BillingCommand extends Command {
  async run() {
    const {args, flags} = this.parse(BillingCommand)
    const {type} = args
    switch (type) {
    case 'diff-product': {
      const diff = require('../libs/billings/products/commands/product-diff')
      diff(this, flags)
      return
    }
    case 'list-products': {
      const list = require('../libs/billings/products/commands/list')
      list(this, flags)
      return
    }
    case 'import-product': {
      const imports = require('../libs/billings/products/commands/import')
      imports(this, flags)
      return
    }
    case 'subscriptions':
      this.log(chalk.green('create'))
      break
    default:
      this.error('given invalid command')
      this.exit(1)
    }
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/dc_hideokamoto/develop/cli/fillet/src/commands/billing.js`)
  }
}

BillingCommand.description = `Stripe Billing
...
Extra documentation goes here
`

BillingCommand.flags = {
  help: flags.help({char: 'h'}),
  force: flags.boolean({
    char: 'f',
    default: false,
    description: 'Should replace plan or products',
  }),
  output: flags.boolean({char: 'o'}),
  fileName: flags.string({char: 'n', default: ''}),
  verbose: flags.boolean({char: 'v', description: 'debug mode'}),
}
BillingCommand.args = [
  {
    name: 'type',
    required: true,
    description: 'products, subscriptions',
  },
]

module.exports = BillingCommand
