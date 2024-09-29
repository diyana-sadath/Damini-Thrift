import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [tryOnResult, setTryOnResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle file selection
    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Handle Try-On button click
    const onTryOn = async () => {
        if (!selectedFile) {
            alert('Please upload an image first!');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        setLoading(true);
        try {
            // Send the image to the backend
            const response = await axios.post('http://localhost:5000/tryon', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Set the result from API
            setTryOnResult(response.data.imageUrl);
        } catch (error) {
            console.error('Error during try-on:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Virtual Try-On</h1>
            <input type="file" onChange={onFileChange} accept="image/*" />
            <button onClick={onTryOn} disabled={loading}>
                {loading ? 'Processing...' : 'Try On'}
            </button>

            {tryOnResult && (
                <div>
                    <h2>Try-On Result:</h2>
                    <img src={tryOnResult} alt="Try-On Result" />
                </div>
            )}
        </div>
    );
}

export default App;
