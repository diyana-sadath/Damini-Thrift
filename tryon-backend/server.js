const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
const port = 5000;

// Multer configuration for handling image uploads
const upload = multer({ dest: 'uploads/' });

app.post('/tryon', upload.single('image'), async (req, res) => {
    try {
        // Read the uploaded image
        const imagePath = req.file.path;
        const imageStream = fs.createReadStream(imagePath);

        // Prepare the form data for API request
        const form = new FormData();
        form.append('image', imageStream);

        // Send image to Virtual Try-On API (e.g., Banuba)
        const apiResponse = await axios.post('https://api.banuba.com/tryon', form, {
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`, // Replace with your actual API key
                ...form.getHeaders(),
            },
        });

        // Process the API response (assuming it returns an image URL)
        const tryOnImageUrl = apiResponse.data.tryOnImageUrl;

        // Respond to frontend with the image URL
        res.json({ imageUrl: tryOnImageUrl });

        // Cleanup: Delete the uploaded image from the server
        fs.unlinkSync(imagePath);
    } catch (error) {
        console.error('Error processing try-on:', error);
        res.status(500).send('Try-on process failed.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
    