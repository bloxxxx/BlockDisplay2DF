const axios = require('axios');

exports.handler = async (event, context) => {
    // Parse the incoming JSON body
    const { content } = JSON.parse(event.body);

    try {
        // Send the content to PrivateBin using axios
        const response = await axios.post('https://privatebin.net/paste', new URLSearchParams({
            content: content
        }));

        // Return the link to the frontend
        const pasteLink = `https://privatebin.net/?${response.data}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ link: pasteLink }),
        };
    } catch (error) {
        console.error('Error uploading to PrivateBin:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error uploading to PrivateBin' }),
        };
    }
};
