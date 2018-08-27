const {green, red} = require('chalk')
const fs = require('fs')
const yaml = require('js-yaml')
const stripe = require('../../../stripe')

// class
const ProductManager = require('../class/manager')
const UpdateProduct = require('../class/update-product')

module.exports = async function (self, flags) {
  const {fileName} = flags
  if (!fileName) {
    self.log(red('File name is required. please set -n option.'))
    return
  }
  const yamlData = fs.readFileSync(`./${fileName}`, 'utf8')
  const fileData = yaml.safeLoad(yamlData)
  const manager = new ProductManager(self, stripe)
  const projectId = await manager.importProduct(fileData, UpdateProduct)
  self.log(`${green('Import product:')}: ${projectId}`)
  // @TODO
  // update plans
  self.log(fileData)
}
