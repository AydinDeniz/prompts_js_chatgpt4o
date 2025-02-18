document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('document-editor');
    const saveButton = document.getElementById('save-document');
    const statusDiv = document.getElementById('status');
    const docId = 'shared-doc'; // Simulated document ID
    let savedVersion = '';

    function fetchDocument() {
        // Simulated fetch - replace with real server interaction as needed
        const savedContent = localStorage.getItem(docId) || '';
        editor.value = savedContent;
        savedVersion = savedContent;
    }

    function saveDocument(content) {
        // Simulated save - replace with real server interaction as needed
        localStorage.setItem(docId, content);
        savedVersion = content;
        displayStatus('Document saved successfully.');
    }

    function displayStatus(message) {
        statusDiv.textContent = message;
        setTimeout(() => { statusDiv.textContent = ''; }, 3000);
    }

    saveButton.addEventListener('click', () => {
        const currentContent = editor.value;

        if (currentContent !== savedVersion) {
            saveDocument(currentContent);
        } else {
            displayStatus('No changes to save.');
        }
    });

    fetchDocument(); // Load the document when the page loads
});