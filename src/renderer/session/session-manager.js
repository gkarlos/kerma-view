/**--session/session-manager.js-------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file session/session.js
 * @author gkarlos 
 * @module session
 * @category Renderer
 * @description 
 *    Defines a simple (for now) session manager.
 *    The SessionManager is a singleton
 *  
 *//*--------------------------------------------------------------*/

class SessionManager {
  sessions = []

  currentSession = null

  createNew() {
    let Session = require('./session')
    
    let session = new Session()

    this.sessions.push(session)
    this.currentSession = session

    return session
  }
}

const instance = new SessionManager()

module.exports = instance;