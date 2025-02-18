document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-recording');
    const stopButton = document.getElementById('stop-recording');
    const detectedTextDiv = document.getElementById('detected-text');
    const translatedTextDiv = document.getElementById('translated-text');

    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('Speech recognition started.');
        };

        recognition.onresult = function(event) {
            let interimText = '';
            let finalText = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalText += transcript;
                } else {
                    interimText += transcript;
                }
            }

            detectedTextDiv.textContent = `Detected Speech: ${finalText || interimText}`;
            translateText(finalText);
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
        };

        recognition.onend = function() {
            console.log('Speech recognition ended.');
        };
    } else {
        alert('Speech recognition not supported in this browser.');
    }

    startButton.onclick = function() {
        recognition.start();
        startButton.disabled = true;
        stopButton.disabled = false;
    };

    stopButton.onclick = function() {
        recognition.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
    };

    async function translateText(text) {
        if (!text) return;
        
        const apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY';
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    target: 'es', // Translate to Spanish
                    format: 'text'
                })
            });
            
            const result = await response.json();
            if (result.data && result.data.translations.length > 0) {
                translatedTextDiv.textContent = `Translation: ${result.data.translations[0].translatedText}`;
            } else {
                translatedTextDiv.textContent = 'Translation error.';
            }
        } catch (error) {
            console.error('Translation API error:', error);
            translatedTextDiv.textContent = 'Translation failed.';
        }
    }
});