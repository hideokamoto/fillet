const {green, red} = require('chalk')
const {diffJson} = require('diff')
const getDiffContent = set => {
  if (set.added && set.added === true) {
    return set.value.replace(/\n/g, '\n+')
  }
  if (set.removed && set.removed === true) {
    return set.value.replace(/\n/g, '\n-')
  }
  return set.value
}

module.exports.ignoreEmptyProps = items => {
  Object.keys(items).forEach(key => {
    const item = items[key]
    if (item && typeof item !== 'undefined') {
      if (typeof item === 'boolean') return
      if (typeof item === 'number') return
      if (typeof item === 'string' && item !== '') return
      if (item instanceof Array && item.length > 0) return
      if (item instanceof Object && Object.keys(item).length > 0) return
    }
    delete items[key]
  })
  return items
}

module.exports.showChangeSet = (previous, next, callback) => {
  const changeSets = diffJson(previous, next)
  changeSets.forEach(set => {
    const content = getDiffContent(set)
    if (set.added && set.added === true) {
      callback(green(`+ ${content}`))
    } else if (set.removed && set.removed === true) {
      callback(red(`- ${content}`))
    } else {
      callback(`  ${content}`)
    }
  })
}
