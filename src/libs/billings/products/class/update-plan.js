
class UpdatePlan {
  constructor(plan) {
    this.plan = plan
  }

  getplan() {
    return this.plan
  }

  getplanId() {
    return this.plan.id || ''
  }

  getMetadata() {
    return this.plan.metadata || {}
  }

  getAllowUpdateProps() {
    return [
      'active',
      'metadata',
      'nickname',
      'trial_period_day',
    ]
  }

  getUpdateProps() {
    /* eslint-disable camelcase */
    const props = {}
    const {plan} = this
    if (!plan || Object.keys(plan).length === 0) return props
    const allowedProps = this.getAllowUpdateProps()
    allowedProps.forEach(allowedProp => {
      if (plan[allowedProp]) props[allowedProp] = plan[allowedProp]
    })
    return props
    /* eslint-enable camelcase */
  }
}
module.exports = UpdatePlan
