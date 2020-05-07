class Component {
  name = "UnnamedComponent"
  rendered = false
  render() {
    console.log(`[warn] render() function for component '${this.name}' not implemented`)
  }
}

module.exports = Component