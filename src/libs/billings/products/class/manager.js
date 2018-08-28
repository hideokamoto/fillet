class ProductManager {
  constructor(oclif, stripe, flags = []) {
    this.oclif = oclif
    this.stripe = stripe
    this.flags = flags
  }
}
module.exports = ProductManager
