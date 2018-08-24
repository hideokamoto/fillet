const {green} = require('chalk')
const stripe = require('../../../libs/stripe')

module.exports = async function (self, flags) {
  const params = {

  }
  const result = await stripe.products.list(params)
  const {format} = flags
  switch (format) {
  case 'text': {
    result.data.forEach(item => {
      self.log(green(item.name) + ':' + item.id)
    })
    return
  }
  case 'json':
    self.log(JSON.stringify(result))
    return
  default:
    self.error('given invalid command')
    self.exit(1)
  }
}
