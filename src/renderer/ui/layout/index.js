/**--renderer/components/layout/index.js----------------------------/
 * @module layout
 * @category Renderer
 * @subcategory Ui
 * @description
 *  This modules defines layouts for the the app.
 *  There are two layouts planned, one for desktop (electron) 
 *  and one for the browser. <br/><br/>
 *  
 * NOTE: Currently only the desktop layout is implemented
 *//*--------------------------------------------------------------*/
module.exports = {
  BaseLayout : require('./BaseLayout'),
  ElectronLayout: require('./ElectronLayout')
}