'use-string'

const BaseLayout      = require('./BaseLayout')

const {InternalError} = require('@common/util/error')
const Events          = require('@renderer/events')

const Split           = require('split.js')



/**
 * Defines the layout for the desktop (electron) app
 * 
 * @memberof module:layout
 * @extends BaseLayout 
 */
class ElectronLayout extends BaseLayout {
  /** 
   * @param {string} [name] A name for this layout
   * @param {Object} [ui] A reference to the UI this layout is part of
   * */
  constructor(app, name="ElectronLayout") {
    if ( !app)
      throw new InternalError("Layout requires an app reference but none was passed")

    super(name)

    this.app = app;
    this.rendered = false;

    /**
     * The Object backing up this layout. The class provides aliases to the main parts
     * of the layout:
     * - {@link ElectronLayout.node}
     * - {@link ElectronLayout.header}
     * - {@link ElectronLayout.body}
     * - {@link ElectronLayout.footer}
     * 
     * Element type refers to DOM [Element]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element}
     * 
     * @type {Object}
     * 
     * @property {Element} node        The DOM node that is the root of the layout
     * @property {Object}  header      The header componenet of this layout
     * @property {Element} header.node The DOM node of the header
     * @property {Object}  body        The body component of this layout
     * @property {Element} body.node   The DOM node of the body
     * @property body.split
     * @property {Object}  body.left
     * @property {Element} body.left.node
     * @property body.left.split
     * @property {Object}  body.left.top
     * @property {Object}  body.left.bottom
     * @property {Object}  body.right
     * @property {Element} body.right.node
     * @property {Object}  footer
     * @property {Element} footer.node
     */
    this.layout = {
      id : null,
      node : null,
      header : {
        id : null,
        node : null,
        left : { id : null, node: null },
        right : { id: null, node: null }
      }
      ,
      body : {
        id : null,
        node : null,
        split: null,
        left: {
          id : null,
          node: null,
          split: null,
          top: {
            id: null,
            node: null
          },
          bottom: {
            node: null
          }
        },
        right: {
          node: null
        }
      }
      ,
      footer : {
        node : null,
      }
    }
  }

  /**
   * The DOM node/root of this layout
   * @type {Object}
   * @see {@link ElectronLayout#layout.node}
   */
  get node() { return this.layout.node }

  /**
   * The header component of this layout
   * @type {Object}
   * @see {@link ElectronLayout#layout.header}
   */
  get header() { return this.layout.header }

  /**
   * The body component of this layout.
   * @type {Object}
   * @see {@link ElectronLayout#layout.body}
   */
  get body() { return this.layout.body }

  /**
   * The footer component of this layout
   * @type {Object}
   * @see {@link ElectronLayout#layout.footer} 
   */
  get footer() { return this.layout.footer }

  render() {
    if ( this.rendered )
      return console.log(`[warn] Layout [${this.name}] is already rendered. This is a no-op`)

    // this.app.ui.registerComponent(this)

    /// Root
    let root = document.createElement('div')
    root.name = "container"
    root.id = "container"
    root.classList.add('container-fluid')
    root.setAttribute("layout-element", "root")
    root.setAttribute("layout", this.name)
    this.layout.node = root
    this.layout.id = root.id
    
    /// Header
    let header = document.createElement('div')
    header.id = "top-toolbar"
    header.classList.add('row', 'navbar')
    header.setAttribute("layout-element", "header")
    this.layout.header.node = header
    this.layout.header.id = header.id

    let headerLeft = document.createElement('div')
    headerLeft.id = "top-toolbar-left"
    headerLeft.setAttribute("layout-element", "header.left")
    this.layout.header.left.node = headerLeft
    this.layout.header.left.id = headerLeft.id
    
    let headerRight = document.createElement('div')
    headerRight.id = "top-toolbar-right"
    headerRight.setAttribute("layout-element", "header.right")
    this.layout.header.right.node = headerRight
    this.layout.header.right.id = headerRight.id

    header.appendChild(headerLeft)
    header.appendChild(headerRight)

    /// Footer
    let footer = document.createElement('div')
    footer.id = "footer"
    footer.classList.add("footer")
    footer.setAttribute("layout-element", "footer")
    this.layout.footer.node = footer
    this.layout.footer.id = footer.id

    /// Body
    let body = document.createElement('div')
    body.id = "main"
    body.classList.add("row", "main-row")
    body.setAttribute("layout-element", "body")

    this.layout.body.node = body
    this.layout.body.id = body.id

    let bodyLeft = document.createElement('div')
    bodyLeft.id = "left"
    bodyLeft.classList.add("h-100")
    bodyLeft.setAttribute("layout-element", "body.left")

    this.layout.body.left.node = bodyLeft
    this.layout.body.left.id = bodyLeft.id

    let bodyRight = document.createElement('div')
    bodyRight.id= "right"
    bodyRight.classList.add("h-100", "right", "split")
    bodyRight.setAttribute("layout-element", "body.right")
    this.layout.body.right.node = bodyRight
    this.layout.body.right.id = bodyRight.id

    /// Body.Left
    let bodyLeftTop = document.createElement('div')
    bodyLeftTop.id = "left-top"
    bodyLeftTop.classList.add("split", "w-100", "card")
    bodyLeftTop.setAttribute("layout-element", "body.left.top")
    this.layout.body.left.top.node = bodyLeftTop
    this.layout.body.left.top.id = bodyLeftTop.id

    let bodyLeftBottom = document.createElement('div')
    bodyLeftBottom.id = "left-bottom"
    bodyLeftBottom.classList.add("split")
    bodyLeftBottom.setAttribute("layout-element", "body.left.bottom")
    this.layout.body.left.bottom.node = bodyLeftBottom
    this.layout.body.left.bottom.id = bodyLeftBottom.id

    bodyLeft.appendChild(bodyLeftTop)
    bodyLeft.appendChild(bodyLeftBottom)
    body.appendChild(bodyLeft)
    body.appendChild(bodyRight)

    root.append(header)
    root.appendChild(body)
    root.appendChild(footer)

    document.body.appendChild(root)

    this.layout.body.split = Split(['#left', '#right'], { 
      sizes: [50, 50], 
      onDrag: () => this.app.emit(Events.UI_RESIZE)
    })

    this.layout.body.left.split = Split(['#left-top', '#left-bottom'], {
      direction: 'vertical', 
      sizes: [50, 50],
      maxSize: 70,
      cursor: 'row-resize', 
      snapOffset : 0,
      dragInterval: 5,
      onDrag: () => this.app.emit(Events.UI_RESIZE)
    });

    this.rendered = true
    // this.app.ui.emit('ui:component-ready', this)
  }
}

module.exports = ElectronLayout