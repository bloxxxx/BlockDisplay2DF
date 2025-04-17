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

// Function to handle file reading and uploading
async function handleFile(file) {
    statusMessage.textContent = 'Processing your file...';
    const reader = new FileReader();

    reader.onload = async function(e) {
        try {
            console.log("File loaded:", e.target.result);

            // Convert the Base64-encoded content to string (assuming the content is Base64 encoded)
            const base64String = new TextDecoder().decode(new Uint8Array(e.target.result));

            // Decode the Base64 string to raw binary data
            const decodedData = atob(base64String); // Base64 decode

            // Now we can decompress using pako (gzip)
            const decompressedData = pako.ungzip(new Uint8Array(decodedData), { to: 'string' });

            console.log("Decompressed data:", decompressedData); // Log decompressed content

            // Upload the decompressed content to Netlify function
            const pasteLink = await uploadToBackend(decompressedData);
            statusMessage.innerHTML = `File uploaded successfully! <a href="${pasteLink}" target="_blank">View on PrivateBin</a>`;
        } catch (err) {
            statusMessage.textContent = `Error: ${err.message}`;
            console.error("Decompression error:", err);
        }
    };

    reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
}

// Function to upload the decompressed data to Netlify Function
async function uploadToBackend(content) {
    const apiUrl = '/.netlify/functions/upload'; // This is the URL for the Netlify Function

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            throw new Error('Failed to upload to backend');
        }

        const result = await response.json();
        return result.link; // The backend will return the PrivateBin link
    } catch (err) {
        console.error("Error in uploadToBackend:", err);
        throw new Error('Error communicating with backend');
    }
}
