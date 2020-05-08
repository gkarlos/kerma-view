/**--session/session-manager.js-----------------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file session/session.js
 * @author gkarlos 
 * @module session
 * @description 
 *    Defines a simple (for now) session manager.
 *    The SessionManager is a singleton
 *  
 *//*---------------------------------------------------------------*/

class SessionManager {

}

const instance = new SessionManager()
Object.freeze(instance)

module.exports = () => instance;