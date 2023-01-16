export function uploadFile() {
    const pdfFile = document.getElementById('pdf-file').files[0];
    const formData = new FormData();
    formData.append('file', pdfFile);

  
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
  }
  