const {green} = require('chalk')
const fs = require('fs')
const stripe = require('../../../libs/stripe')

module.exports = async function (self, flags) {
  const params = {

  }
  const result = await stripe.products.list(params)
  const {format, output} = flags
  try {
    if (output) {
      const fileName = flags.fileName || 'products'
      fs.writeFileSync(`./${fileName}.json`, JSON.stringify(result.data, null, '   '))
      self.log(green('Export file:', `${fileName}.json`))
      return
    }
  } catch (e) {
    self.log(e)
    self.exit(1)
    return
  }
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
