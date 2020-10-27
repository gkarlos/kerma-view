const path = require('path')

function resolve(filepath) {
  if (filepath[0] === '~')
      return path.join(process.env.HOME, path.resolve(filepath.slice(1)));
  return path.resolve(filepath);
}

module.exports = {
  resolve
}