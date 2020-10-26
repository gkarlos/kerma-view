class Input {
  constructor(path, args) {
    this.path = path,
    this.args = args
  }
  getPath() { return this.path }
  getArgs() { return this.args }
}

module.exports = Input