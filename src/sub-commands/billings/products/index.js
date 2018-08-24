const list = require('./list')
module.exports = function (self, args, flags) {
  switch (args.action) {
  case 'list':
    list(self, flags)
    break
  default:
    self.error('given invalid command')
    self.exit(1)
  }
}
