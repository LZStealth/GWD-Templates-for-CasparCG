/*
 *   Usage:
 *   insert a script reference in the HTML header.
 *   ex: <script type="text/javascript" src="CasparCG.js"></script>
 *   Make sure that the class that you refer to is the innermost tag.
 *   Either the item will have it's content replace or src updated if an image
 *
 *   Items with classes 'CasparCG-XXX' will be replaced
 *   So f0 would have the class 'CasparCG-f0'
 *
 *   put together by Tomas Linden
 *   modified by Mark Rapson
 */

// Global variable for data from CasparCG
var dataCaspar = {};

// Replace characters that could become a problem if left as is
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Parse templateData into an XML object
function parseCaspar(str) {
  var xmlDoc;
  if (window.DOMParser) {
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(str, "text/xml");
  }
  dataCaspar = XML2JSON(xmlDoc.documentElement.childNodes);
}


// Make the XML templateData message into a more simple key:value object
function XML2JSON(node) {
  var data = {}; // resulting object
  for (k = 0; k < node.length; k++) {
    var idCaspar = node[k].getAttribute("id");
    var valCaspar = node[k].childNodes[0].getAttribute("value");
    if (idCaspar != undefined && valCaspar != undefined) {
      data[idCaspar] = valCaspar;
    };
  }
  return data;
}

// Main function to insert data
function dataInsert(dataCaspar) {
  for (var idCaspar in dataCaspar) {
    var applicableElements = document.getElementsByClassName('CasparCG-' + idCaspar);
    if (applicableElements) {
      // Loop through Applicable DIVs
      [].slice.call(applicableElements).forEach(function(currentElement) {
        if (currentElement.tagName == 'img') {
          //Set Image if img item
          currentElement.src = dataCaspar[idCaspar];
        } else {
          //Set InnerHTML otherwise
          currentElement.innerHTML = escapeHtml(dataCaspar[idCaspar]);
        }
      })
    }
  }
}

// Call for a update of data from CasparCG client
function update(str) {
  parseCaspar(str); // Parse templateData into an XML object
  dataInsert(dataCaspar); // Insert data
}

// insert data from CasparCg client when activated
function play(str) {
  parseCaspar(str); // Parse templateData into an XML object
  dataInsert(dataCaspar); // Insert data
}

// Call for a next from CasparCG client
function next() {
  gwd.actions.timeline.play('document.body');
}

// Call for a stop from CasparCG client
function stop() {
  gwd.actions.timeline.gotoAndPlay('document.body', 'stop');
}
