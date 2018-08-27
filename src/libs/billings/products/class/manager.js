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
module.exports = ProductManager
