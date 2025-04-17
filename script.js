// Getting references to the drop area and the status message elements
const dropArea = document.getElementById('drop-area');
const statusMessage = document.getElementById('status');

// Handle file drop (drag and drop functionality)
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.style.backgroundColor = "#e7f8e7";
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.backgroundColor = "transparent";
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.style.backgroundColor = "transparent";

    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.bdengine')) {
        handleFile(file);
    } else {
        statusMessage.textContent = 'Please upload a valid .bdengine file.';
    }
});
