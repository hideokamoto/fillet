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
  const param = {
    product: fileData.id,
  }
  const plans = await stripe.plans.list(param)
  const items = plans.data.map(plan => ignoreEmptyProps(plan))
  showChangeSet(items, fileData.plans, self.log)
}
