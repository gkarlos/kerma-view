/**--renderer/components/layout/index.js----------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file renderer/components/layout/index.js
 * @author gkarlos 
 * @module renderer/components/layout
 * @memberof namespace:components
 * @description
 *  This modules defines layouts for the the app.
 *  There are two layouts planned, one for desktop (electron) 
 *  and one for the browser. <br/><br/>
 *  
 * NOTE: Currently only the desktop layout is implemented
 *//*--------------------------------------------------------------*/
module.exports = {
  BaseLayout : require('./BaseLayout'),
  ElectronLayout: require('./ElectronLayout'),
}