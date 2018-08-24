const {Command, flags} = require('@oclif/command')
const products = require('../sub-commands/billings/products')

class BillingCommand extends Command {
  async run() {
    const {args, flags} = this.parse(BillingCommand)
    const {type} = args
    switch (type) {
    case 'products':
      products(this, args, flags)
      return
    case 'create':
      this.log('create')
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
  verbose: flags.boolean({char: 'v', description: 'debug mode'}),
}
BillingCommand.args = [
  {
    name: 'type',
    required: true,
    description: 'products, subscriptions',
  }, {
    name: 'action',
    required: true,
    description: 'create',
  },
]

module.exports = BillingCommand
