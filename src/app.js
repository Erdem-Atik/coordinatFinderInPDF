import {parseLatLong} from './latLongToDec.js';
const pdfjsLib = require('pdfjs-dist');

const input = document.getElementById('pdf-file')
const uploadButton = document.getElementById('upload-button')

uploadButton.addEventListener('click', function() {
  const file = input.files[0]
  if (!file) {
      alert('Please select a file!')
      return
  }

  const reader = new FileReader()
  reader.onload = function() {
      const pdfData = new Uint8Array(reader.result)
      console.log(pdfData);
  }
  reader.readAsArrayBuffer(file)
  console.log( reader.readAsArrayBuffer(file));
})



function parsePDF(pdfData) {
    pdfjsLib.getDocument(pdfData).promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
            var scale = 1.5;
            var viewport = page.getViewport({scale: scale});

            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            page.render(renderContext);
        });
    });
}

