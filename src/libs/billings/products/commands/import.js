const {red} = require('chalk')
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
  if (fileData.id) {
    // update product
    const updateProduct = new UpdateProduct(fileData)
    await manager.updateProduct(updateProduct)
  } else {
    // create product
    await manager.createProduct(fileData)
  }
  // @TODO
  // update plans
  self.log(fileData)
}
