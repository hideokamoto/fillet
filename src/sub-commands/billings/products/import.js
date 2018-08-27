const {green, red} = require('chalk')
const fs = require('fs')
const yaml = require('js-yaml')
const stripe = require('../../../libs/stripe')

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
    // @TODO
    // update product
    const updateProduct = new UpdateProduct(fileData)
    await manager.updateProduct(updateProduct)
  } else {
    // @TODO
    // create product
    await manager.createProduct(fileData)
  }
  self.log(fileData)
}

class UpdateProduct {
  constructor(product) {
    this.product = product
  }

  getProduct() {
    return this.product
  }

  getProductId() {
    return this.product.id || ''
  }

  getMetadata() {
    return this.product.metadata || {}
  }

  getUpdateProps() {
    /* eslint-disable camelcase */
    const props = {}
    const {product} = this
    if (!product || Object.keys(product).length === 0) return props
    const {
      description,
      images,
      metadata,
      name,
      package_dimensions,
      shippable,
      url,
      deactivate_on,
      caption,
      attributes,
      active,
    } = product
    if (description) props.description = description
    if (images) props.images = images
    if (metadata) props.metadata = metadata
    if (name) props.name = name
    if (package_dimensions) props.package_dimensions = package_dimensions
    if (shippable) props.shippable = shippable
    if (url) props.url = url
    if (deactivate_on) props.deactivate_on = deactivate_on
    if (caption) props.caption = caption
    if (attributes) props.attributes = attributes
    if (active) props.active = active
    return props
    /* eslint-enable camelcase */
  }
}

class ProductManager {
  constructor(oclif, stripe, stage = 'development') {
    this.oclif = oclif
    this.stripe = stripe
    this.stage = stage
  }

  async updateProduct(product) {
    try {
      const id = product.getProductId()
      const props = product.getUpdateProps()
      const result = await this.stripe.products.update(id, props)
      if (result instanceof Error) throw result
      this.oclif.log(result)
      this.oclif.log('OK')
    } catch (e) {
      this.oclif.log('Fail to update product')
      throw e
    }
  }

  async createProduct(param) {
    try {
      if (param.plans) delete param.plans
      const result = await this.stripe.products.create(param)
      if (result instanceof Error) throw result
      this.oclif.log(result)
      this.oclif.log('OK')
    } catch (e) {
      this.oclif.log('Fail to create product')
      throw e
    }
  }


}
