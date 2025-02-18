document.addEventListener('DOMContentLoaded', () => {
    const flashcards = [
        { word: 'Bonjour', translation: 'Hello' },
        { word: 'Merci', translation: 'Thank you' },
        { word: 'Pomme', translation: 'Apple' },
        { word: 'Chat', translation: 'Cat' },
        { word: 'Chien', translation: 'Dog' }
    ];

    let currentFlashcardIndex = 0;
    const flashcardDiv = document.getElementById('flashcards');
    const answerDiv = document.getElementById('answer');

    function displayFlashcard() {
        const { word } = flashcards[currentFlashcardIndex];
        flashcardDiv.textContent = word;
        answerDiv.textContent = '';
    }

    document.getElementById('show-answer').addEventListener('click', () => {
        const { translation } = flashcards[currentFlashcardIndex];
        answerDiv.textContent = translation;
    });

    document.getElementById('next-word').addEventListener('click', () => {
        currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
        displayFlashcard();
    });

    displayFlashcard();
});