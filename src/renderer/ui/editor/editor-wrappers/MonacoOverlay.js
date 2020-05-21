  // let overlayDom = document.createElement('div');
  //   overlayDom.id = 'overlayId';
  //   overlayDom.style.width = '100%';
  //   overlayDom.style.background = '#ffb275';
// 
    // // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ioverlaywidget.html
    // let overlayWidget = {
    //   getId: () => 'overlay.zone.widget',
    //   getDomNode: () => overlayDom,
    //   getPosition: () => null
    // };
    // editor.addOverlayWidget(overlayWidget);

    // // Used only to compute the position.
    // let zoneNode = document.createElement('div');
    // zoneNode.style.background = '#8effc9';
    // zoneNode.id = "zoneId";

    // // Can be used to fill the margin
    // let marginDomNode = document.createElement('div');
    // marginDomNode.style.background = '#ff696e';
    // marginDomNode.id = "zoneMarginId";

    // editor.changeViewZones(function(changeAccessor) {
    //   changeAccessor.addZone({
    //     afterLineNumber: 3,
    //     heightInLines: 3,
    //     domNode: zoneNode,
    //     marginDomNode: marginDomNode,
    //     onDomNodeTop: top => {
    //       overlayDom.style.top = top + "px";
    //     },
    //     onComputedHeight: height => {
    //       overlayDom.style.height = height + "px";
    //     }

    //   });
    // });