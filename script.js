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
