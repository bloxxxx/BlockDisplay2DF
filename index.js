// Function to handle file reading and uploading
async function handleFile(file) {
    statusMessage.textContent = 'Processing your file...';
    const reader = new FileReader();

    reader.onload = async function(e) {
        try {
            console.log("File loaded:", e.target.result);

            // Convert the Base64-encoded content to a string (assuming the content is Base64 encoded)
            const base64String = new TextDecoder().decode(new Uint8Array(e.target.result));

            // Decode the Base64 string to raw binary data
            const decodedData = atob(base64String); // Base64 decode

            // Convert the decoded data into an array of bytes (Uint8Array)
            const byteArray = new Uint8Array(decodedData.length);
            for (let i = 0; i < decodedData.length; i++) {
                byteArray[i] = decodedData.charCodeAt(i);
            }

            // Now we can decompress using pako (gzip)
            const decompressedData = pako.ungzip(byteArray, { to: 'string' });

            console.log("Decompressed data:", decompressedData); // Log decompressed content

            // Upload the decompressed content to PrivateBin (anonymous paste)
            const privatebinLink = await uploadToPrivateBin(decompressedData);

            // Display the link to the user
            statusMessage.innerHTML = `File uploaded successfully! <a href="${privatebinLink}" target="_blank">View on PrivateBin</a>`;
        } catch (err) {
            statusMessage.textContent = `Error: ${err.message}`;
            console.error("Decompression error:", err);
        }
    };

    reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
}

// Function to upload the decompressed data to PrivateBin using CORS proxy
async function uploadToPrivateBin(content) {
    const proxyUrl = 'https://cors-proxy.htmldriven.com/?url='; // CORS proxy URL
    const apiUrl = 'https://privatebin.net/paste'; // PrivateBin URL (change if needed)

    // Prepare data to post
    const data = new FormData();
    data.append('content', content);

    try {
        // Send the request through the CORS proxy
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
            method: 'POST',
            body: data,
        });

        // Check for a successful response
        if (!response.ok) {
            throw new Error('Error uploading to PrivateBin');
        }

        // The response should contain the URL to the paste
        const result = await response.text();

        // Return the URL in the correct format
        return `https://privatebin.net/?${result}`; // This will give the correct link to the paste
    } catch (err) {
        console.error("Error in uploadToPrivateBin:", err);
        throw new Error('Error uploading to PrivateBin.');
    }
}

