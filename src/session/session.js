class Session {
  id = null;

  constructor(id=null) {
    if ( !id) {
      this.id = require('crypto').randomBytes(16).toString('base64');
    }
  }
}

module.exports = Session