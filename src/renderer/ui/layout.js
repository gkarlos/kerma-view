var initialized = false;

module.exports = (app) => {
  var ui = app.ui
  const Split = require('split.js')

  const layout = {
    header : {
      selector : "#top-toolbar",
      node: null,
      
      left : {
        selector : "#top-toolbar-left",
        node: null
      },
      right : {
        selector : "#top-toolbar-right",
        node: null
      }
    }
    ,
    main : {
      selector : "#main",
      node : null,
      split : null,

      left  : {
        selector : "#left",
        node: null,
        split: null,

        top : {
          selector : "#left-top",
          node : null
        },
        bottom : {
          selector : "#left-bottom",
          node : null
        }
      },

      right : {
        selector : "#right",
        node: null,
      },
    }
    ,
    footer : {
      selector : "#footer",
      node : null
    },

    initialized : false,
  }

  layout.init = () => {
    if ( initialized)
      console.log('[info]', 'layout.init() called on an initialized layout. This is no-op')
    else {
      layout.header.node           = document.querySelector(layout.header.selector)
      
      layout.header.left.node      = document.querySelector(layout.header.left.selector)
      layout.header.left.node.style.width = "50%"

      layout.header.right.node     = document.querySelector(layout.header.right.selector)
      layout.header.right.node.style.width = "50%"

      layout.main.node             = document.querySelector(layout.main.selector)
      layout.main.left.node        = document.querySelector(layout.main.left.selector)
      layout.main.left.top.node    = document.querySelector(layout.main.left.top.selector)
      layout.main.left.bottom.node = document.querySelector(layout.main.left.bottom.selector)
      layout.main.right.node       = document.querySelector(layout.main.right.selector)
      layout.footer.node           = document.querySelector(layout.footer.selector)

      layout.main.split = Split(['#left', '#right'], { 
        sizes: [50, 50], 
        onDrag: () => app.ui.emit('ui:resize')
      })

      layout.main.left.split = Split(['#left-top', '#left-bottom'], {
        direction: 'vertical', 
        sizes: [50, 50],
        cursor: 'row-resize', 
        snapOffset : 0,
        expandToMin: true,
        dragInterval: 15,
        onDrag: () => app.ui.emit('ui:resize')
      });

      layout.initialized = true;

      console.groupCollapsed("[info] ui: layout: initialized")
      console.log(layout)
      console.groupEnd()

      return layout;
    }
  }

  return layout
}