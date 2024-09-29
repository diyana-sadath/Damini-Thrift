// Handle person image upload and display preview
document.getElementById('personUpload').onchange = function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Display uploaded person image in the preview area
    reader.onload = function (e) {
        document.getElementById('personImg').src = e.target.result;
    };
    reader.readAsDataURL(file);
};

// Handle garment image upload and display preview
document.getElementById('garmentUpload').onchange = function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Display uploaded garment image in the preview area
    reader.onload = function (e) {
        document.getElementById('garmentImg').src = e.target.result;
    };
    reader.readAsDataURL(file);
};

// Function to send images to Hugging Face API and process them
async function applyVirtualTryOn() {
    const personElement = document.getElementById('personImg');
    const garmentElement = document.getElementById('garmentImg');

    const personDataUrl = personElement.src;
    const garmentDataUrl = garmentElement.src;

    if (!personDataUrl || !garmentDataUrl) {
        alert("Please upload both images first.");
        return;
    }

    const personBase64 = personDataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
    const garmentBase64 = garmentDataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/adamw/virtual-try-on', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: {
                    person: personBase64,
                    garment: garmentBase64
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result);

        const resultImageUrl = result.generated_image_url || "data:image/png;base64," + result.image;
        document.getElementById('resultImg').src = resultImageUrl;

    } catch (error) {
        console.error('API call failed:', error);
        alert("Failed to process images. Check the console for more details.");
    }
}
