const {green, red} = require('chalk')
const {diffJson} = require('diff')
const fs = require('fs')
const yaml = require('js-yaml')
const stripe = require('../../../stripe')

const getDiffContent = set => {
  if (set.added && set.added === true) {
    return set.value.replace(/\n/g, '\n+')
  }
  if (set.removed && set.removed === true) {
    return set.value.replace(/\n/g, '\n-')
  }
  return set.value
}

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
  const product = await stripe.products.retrieve(fileData.id)
  Object.keys(product).forEach(key => {
    const item = product[key]
    if (item) {
      if (typeof item === 'boolean') return
      if (typeof item === 'string' && item !== '') return
      if (item instanceof Array && item.length > 0) return
      if (item instanceof Object && Object.keys(item).length > 0) return
    }
    delete product[key]
  })
  delete product.plans
  delete product.object
  delete product.skus
  delete fileData.plans
  const changeSets = diffJson(product, fileData)
  changeSets.forEach(set => {
    const content = getDiffContent(set)
    if (set.added && set.added === true) {
      self.log(green(`+ ${content}`))
    } else if (set.removed && set.removed === true) {
      self.log(red(`- ${content}`))
    } else {
      self.log(`  ${content}`)
    }
  })
}
