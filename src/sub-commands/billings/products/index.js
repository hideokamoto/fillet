module.exports = function (self, args, flags) {
  switch (args.action) {
  case 'list':
    self.log(flags)
    self.log('list')
    break
  default:
    self.error('given invalid command')
    self.exit(1)
  }
}
