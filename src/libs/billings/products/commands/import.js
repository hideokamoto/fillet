const {green, red} = require('chalk')
const fs = require('fs')
const yaml = require('js-yaml')
const stripe = require('../../../stripe')

// class
const ProductManager = require('../class/product-manager')
const PlanManager = require('../class/plan-manager')
const UpdateProduct = require('../class/update-product')

const importProduct = async (self, stripe, fileData) => {
  const manager = new ProductManager(self, stripe)
  const product = await manager.importProduct(fileData, UpdateProduct)
  self.log(`${green('Import product:')}: ${product.id}`)
  return product
}

module.exports = async function (self, flags) {
  const {fileName} = flags
  if (!fileName) {
    self.log(red('File name is required. please set -n option.'))
    return
  }
  const yamlData = fs.readFileSync(`./${fileName}`, 'utf8')
  const fileData = yaml.safeLoad(yamlData)
  const product = await importProduct(self, stripe, fileData)
  fileData.id = product.id
  // @TODO
  // update plans
  const manager = new PlanManager(self, stripe, flags)
  fileData.plans = await manager.importPlans(product, fileData)
  const output = yaml.safeDump(fileData)
  fs.writeFileSync(`./${fileName}.yml`, output)
  self.log(green('Finished'))
}

