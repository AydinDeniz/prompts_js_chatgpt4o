
// Function to compress an image file using canvas and FileReader
function compressImage(file, compressionLevel = 0.7, callback) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const img = new Image();
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to image dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image onto canvas
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // Compress image and get the base64 encoded string
            canvas.toBlob((blob) => {
                callback(blob);
            }, 'image/jpeg', compressionLevel);
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

// Usage example with an HTML file input
document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    compressImage(file, 0.7, (compressedBlob) => {
        // Create a link to download the compressed image
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(compressedBlob);
        downloadLink.download = 'compressed_image.jpg';
        downloadLink.innerText = 'Download Compressed Image';
        
        // Append the link to the DOM
        document.body.appendChild(downloadLink);
    });
});
