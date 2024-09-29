const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const port = 5000;

// Set up multer for file handling
const upload = multer({ dest: 'uploads/' });

app.post('/tryon', upload.single('image'), async (req, res) => {
    try {
        const imageFile = fs.createReadStream(req.file.path);

        // Set up form data to send to the API
        const form = new FormData();
        form.append('image', imageFile);

        // Replace 'YOUR_API_KEY' with your actual API key
        const apiResponse = await axios.post('https://api.banuba.com/tryon', form, {
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`,
                ...form.getHeaders(),
            },
        });

        // Process the response from the API (assuming it returns a URL to the processed image)
        const tryOnImageUrl = apiResponse.data.tryOnImageUrl;

        // Respond back to the client (React frontend)
        res.json({ imageUrl: tryOnImageUrl });

        // Clean up uploaded image after processing
        fs.unlinkSync(req.file.path);
    } catch (error) {
        console.error('Error processing try-on:', error);
        res.status(500).send('An error occurred during the try-on process.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
