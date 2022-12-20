
// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = '../helloWorldLoc.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

const PAGE_NUMBER = 1; // it should not be hard coded!
const PAGE_SCALE = 1.5;
const SVG_NS = "http://www.w3.org/2000/svg";

const pageforward = function(){
  
}

function buildSVG(viewport, textContent) {
    // Building SVG with size of the viewport (for simplicity)
    const svg = document.createElementNS(SVG_NS, "svg:svg");
    svg.setAttribute("width", viewport.width + "px");
    svg.setAttribute("height", viewport.height + "px");
    // items are transformed to have 1px font size
    svg.setAttribute("font-size", 1);
  
    // processing all items
    textContent.items.forEach(function (textItem) {
      // we have to take in account viewport transform, which includes scale,
      // rotation and Y-axis flip, and not forgetting to flip text.
      const tx = pdfjsLib.Util.transform(
        pdfjsLib.Util.transform(viewport.transform, textItem.transform),
        [1, 0, 0, -1, 0, 0]
      );
      const style = textContent.styles[textItem.fontName];
      // adding text element
      const text = document.createElementNS(SVG_NS, "svg:text");
      text.setAttribute("transform", "matrix(" + tx.join(" ") + ")");
      text.setAttribute("font-family", style.fontFamily);
      text.textContent = textItem.str;
      svg.append(text);
    });
    return svg;
  }

  async function pageLoaded() {
    // Loading document and page text content
    const loadingTask = pdfjsLib.getDocument(url);
    const pdfDocument = await loadingTask.promise;
    const page = await pdfDocument.getPage(PAGE_NUMBER);
    const viewport = page.getViewport({ scale: PAGE_SCALE });
    const textContent = await page.getTextContent();

    textContent.items.forEach(el=>{
        if(el.str.includes('°') )
        {console.log(el.str);}
    });
    // building SVG and adding that to the DOM
    const svg = buildSVG(viewport, textContent);
    document.getElementById("pageContainer").append(svg);
    // Release page resources.
    page.cleanup();
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof pdfjsLib === "undefined") {
      // eslint-disable-next-line no-alert
      alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
      return;
    }
    pageLoaded();
  });  



// // Asynchronous download of PDF
// var loadingTask = pdfjsLib.getDocument(url);
// loadingTask.promise.then(function(pdf) {
//   console.log('PDF loaded');
  
//   // Fetch the first page
//   var pageNumber = 1;
//   pdf.getPage(pageNumber).then(function(page) {
//     console.log('Page loaded');
    
//     var scale = 1.5;
//     var viewport = page.getViewport({scale: scale});

//     // Prepare canvas using PDF page dimensions
//     var canvas = document.getElementById('the-canvas');
//     var context = canvas.getContext('2d');
//     canvas.height = viewport.height;
//     canvas.width = viewport.width;

//     // Render PDF page into canvas context
//     var renderContext = {
//       canvasContext: context,
//       viewport: viewport
//     };
//     var renderTask = page.render(renderContext);
//     renderTask.promise.then(function () {
//       console.log('Page rendered');
//     });
//   });
// }, function (reason) {
//   // PDF loading error
//   console.error(reason);
// });