const {green, red} = require('chalk')
const Manager = require('./manager')

// class
const UpdatePlan = require('../class/update-plan')

class ProductManager extends Manager {
  async updateProduct(product) {
    try {
      const id = product.getProductId()
      const props = product.getUpdateProps()
      const result = await this.stripe.products.update(id, props)
      if (result instanceof Error) throw result
      this.oclif.log(result)
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
      return update.id
    }
    // create product
    const product = await this.createProduct(fileData)
    return product.id
  }

  async createPlan(plan, productId) {
    try {
      if (!plan.product) plan.product = ''
      plan.product = productId
      const result = await this.stripe.plans.create(plan)
      this.oclif.log(green('plan created:' + result.id))
      return result
    } catch (e) {
      this.oclif.log(red(e))
      throw e
    }
  }

  async updatePlan(plan) {
    try {
      const updatePlan = new UpdatePlan(plan)
      const prop = updatePlan.getUpdateProps()
      const result = await this.stripe.plans.update(plan.id, prop)
      if (result instanceof Error) throw result
      this.oclif.log(green(`plan: ${plan.id} has been updated`))
      return result
    } catch (e) {
      this.oclif.log(red('Fail to update product:'))
      this.oclif.log(JSON.stringify(e))
      throw e
    }
  }

  async dispatchImportPlan(plan) {
    if (!plan.id) return 'create'
    try {
      const currentPlan = await this.stripe.plans.retrieve(plan.id)
      if (currentPlan instanceof Error) throw currentPlan
      const updatePlan = new UpdatePlan(plan)
      const allowedProps = updatePlan.getAllowUpdateProps()
      let shouldReplace = false
      Object.keys(plan).forEach(key => {
        if (allowedProps.indexOf(key) !== -1) return
        if (plan[key] !== currentPlan[key]) {
          shouldReplace = true
        }
      })
      // Check is the plan updateable
      if (shouldReplace) {
        const {force} = this.flags
        if (force) return 'force-update'
        return 'replace-confirm'
      }
      return 'update'
    } catch (e) {
      if (e.statusCode === 404 && e.message.startsWith('No such plan')) {
        return 'create'
      }
      this.oclif.error(e)
      return 'error'
    }
  }

  async dispatchImportPlans(plan, productId) {
    if (!plan.id) {
      const createdPlan = await this.createPlan(plan, productId)
      return createdPlan
    }
    try {
      const currentPlan = await this.stripe.plans.retrieve(plan.id)
      if (currentPlan instanceof Error) throw currentPlan
      // Check is the plan updateable
      if (plan.amount !== currentPlan.amount) {
        // force flag
        this.oclif.log(red(`plan: ${plan.id} has been skipped.`))
        this.oclif.log(red('If you replace the plan, please run the command with -f / --force option'))
        return currentPlan
      }
      // @TODO update stripe plan
      return currentPlan
    } catch (e) {
      if (e.statusCode === 404 && e.message.startsWith('No such plan')) {
        const newPlan = await this.createPlan(plan, productId)
        return newPlan
      }
      this.oclif.error(e)
    }
  }

  async importPlans(product, fileData) {
    if (!product || Object.keys(product).lenght === 0) return this.oclif.log('Product not found')
    if (!fileData.plans || fileData.plans.length === 0) return this.oclif.log('No plans')
    const {plans} = fileData
    const productId = product.id
    await Promise.all(plans.map(async (plan, key) => {
      const action = await this.dispatchImportPlan(plan, productId)
      let data = {}
      switch (action) {
      case 'create':
        data = await this.createPlan(plan, productId)
        break
      case 'update':
        data = await this.updatePlan(plan)
        break
      case 'force-update':
        this.oclif.log('force update')
        break
      case 'replace-confirm':
        this.oclif.log(red(`plan: ${plan.id} has been skipped.`))
        this.oclif.log(red('If you replace the plan, please run the command with -f / --force option'))
        break
      default:
        break
      }
      if (!plan.id) plans[key].id = data.id || ''
    }))
    return plans
  }
}
module.exports = ProductManager
