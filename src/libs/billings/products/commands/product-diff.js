const {red} = require('chalk')
const fs = require('fs')
const yaml = require('js-yaml')
const stripe = require('../../../stripe')
const {showChangeSet, ignoreEmptyProps} = require('../../../changeset')

module.exports = async function (self, flags) {
  const {fileName} = flags
  if (!fileName) {
    self.log(red('File name is required. please set -n option.'))
    return
  }
  const yamlData = fs.readFileSync(`./${fileName}`, 'utf8')
  const fileData = yaml.safeLoad(yamlData)
  if (!fileData.id) {
    self.log(red('[ERROR]: Product id is required'))
    return
  }
  const data = await stripe.products.retrieve(fileData.id)
  const product = ignoreEmptyProps(data)
  delete product.plans
  delete product.object
  delete product.skus
  delete fileData.plans
  showChangeSet(product, fileData, self.log)
}
