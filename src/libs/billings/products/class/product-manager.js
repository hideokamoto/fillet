const Manager = require('./manager')

class ProductManager extends Manager {
  async updateProduct(product) {
    try {
      const id = product.getProductId()
      const props = product.getUpdateProps()
      const result = await this.stripe.products.update(id, props)
      if (result instanceof Error) throw result
      return result
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
      return result
    } catch (e) {
      this.oclif.log('Fail to create product')
      throw e
    }
  }

  async importProduct(fileData, UpdateProduct) {
    if (fileData.id) {
      // update product
      const updateProduct = new UpdateProduct(fileData)
      const update = await this.updateProduct(updateProduct)
      return update
    }
    // create product
    const product = await this.createProduct(fileData)
    return product
  }
}
module.exports = ProductManager
