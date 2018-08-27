
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
module.exports = UpdateProduct
