import {parseLatLong} from './latLongToDec.js';


const url = new URL('../helloWorldLoc.pdf', import.meta.url);

const grid = document.querySelector(".grid");

let img = document.createElement('iframe');
img.src = new URL('../helloWorldLoc.pdf', import.meta.url);
document.body.appendChild(img);


// Loaded via <script> tag, create shortcut to access PDF.js exports.
const pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

const PAGE_NUMBER = 1; // it should not be hard coded!
const PAGE_SCALE = 1.5;
const SVG_NS = "http://www.w3.org/2000/svg";

const pageforward = function(){

}

pageforward()

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

   const geoInPDF= textContent.items.filter(el=>{
    return el.str.includes('°')
    })
    console.log(geoInPDF);
    let geoCoordInPDF = [];
    textContent.items.forEach(el=>{
      if(el.str.includes('°')){
        geoCoordInPDF.push(el.str)
      }
    })
    console.log(parseLatLong(geoCoordInPDF.join(' ')));


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
