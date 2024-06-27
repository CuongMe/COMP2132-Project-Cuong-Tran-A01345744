document.addEventListener('DOMContentLoaded', () => {
    // Array of words with hints
    const words = [
        { word: 'unicorn', hint: 'Horse with horn' },
        { word: 'rainbow', hint: 'Pride Flag' },
        { word: 'pizza', hint: 'Popular Italian Dish' },
        { word: 'bicycle', hint: 'A two-wheeled vehicle powered by pedaling' },
        { word: 'chocolate', hint: 'For Valentine' },
        { word: 'kangaroo', hint: 'Australian Rat' },
        { word: 'astronaut', hint: 'A person who travels in space' },
        { word: 'dinosaur', hint: 'In Jurassic Park' },
        { word: 'avocado', hint: 'Green Fruit, Mehico' },
        { word: 'robot', hint: 'Terminator' },
    ];
    
    // Game state variables
    let selectedWord = '';
    let guessedLetters = [];
    let incorrectGuesses = 0;
    const maxIncorrectGuesses = 10;

    // DOM elements
    const wordDisplay = document.getElementById('word-display');
    const hangmanImg = document.getElementById('hangman-img');
    const letterButtons = document.getElementById('letter-buttons');
    const hintButton = document.getElementById('hint-button');
    const playAgainButton = document.getElementById('play-again-button');
    const message = document.getElementById('message');

    // Start a new game
    function startGame() {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        selectedWord = randomWord.word;
        guessedLetters = [];
        incorrectGuesses = 0;
        hangmanImg.src = 'images/step0.jpg';
        message.textContent = '';
        message.classList.remove('fade-out');
        playAgainButton.style.display = 'none';
        hintButton.disabled = true;
        createLetterButtons();
        updateWordDisplay();
    }

    // Update the displayed word
    function updateWordDisplay() {
        const displayWord = selectedWord.split('').map(letter => 
            guessedLetters.includes(letter) ? letter : '_').join(' ');
        wordDisplay.textContent = displayWord;

        if (!displayWord.includes('_')) {
            message.textContent = 'You won!';
            fireworkAnimation();
            endGame();
        }
    }

    // Handle a guessed letter
    function handleGuess(letter) {
        if (guessedLetters.includes(letter)) {
            return; // If letter is already guessed, do nothing
        }

        guessedLetters.push(letter);
        const button = document.getElementById(`btn-${letter}`);
        button.disabled = true;

        if (selectedWord.includes(letter)) {
            button.classList.add('correct');
            updateWordDisplay();
        } else {
            button.classList.add('incorrect');
            incorrectGuesses++;
            hangmanImg.src = `images/step${incorrectGuesses}.jpg`;

            if (incorrectGuesses === maxIncorrectGuesses) {
                message.textContent = `You lost! The word was ${selectedWord}.`;
                losingAnimation();
                endGame();
            }
        }

        if (incorrectGuesses >= 5) {
            hintButton.disabled = false;
        }
    }

    // Create letter buttons for guessing
    function createLetterButtons() {
        letterButtons.innerHTML = '';
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i).toLowerCase();
            const button = document.createElement('button');
            button.textContent = letter;
            button.id = `btn-${letter}`;
            button.classList.add('letter-button');
            button.addEventListener('click', () => handleGuess(letter));
            letterButtons.appendChild(button);
        }
    }

    // Show a hint for the word
    function showHint() {
        if (incorrectGuesses < 5) {
            return;
        }
        alert(`Hint: ${words.find(word => word.word === selectedWord).hint}`);
        hintButton.disabled = true;
    }

    // Firework animation
    function fireworkAnimation() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    // Losing animation
    function losingAnimation() {
        message.classList.add('shake');
        setTimeout(() => {
            message.classList.remove('shake');
        }, 500);
    }
    

    // End the game and disable all buttons
    function endGame() {
        document.querySelectorAll('.letter-button').forEach(button => button.disabled = true);
        playAgainButton.style.display = 'inline';
    }

    // Event listeners
    hintButton.addEventListener('click', showHint);
    playAgainButton.addEventListener('click', startGame);

    // Initialize the game
    startGame();
});