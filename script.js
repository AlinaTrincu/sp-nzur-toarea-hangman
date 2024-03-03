// Selectarea elementelor din DOM
const wordDisplay = document.querySelector(".word-display"); // Elementul care afișează cuvântul
const guessesText = document.querySelector(".guesses-text b"); // Textul care afișează numărul de ghiciri greșite
const keyboardDiv = document.querySelector(".keyboard"); // Div-ul care conține butoanele pentru tastatură
const hangmanImage = document.querySelector(".hangman-box img"); // Imaginea pentru stadiile jocului
const gameModal = document.querySelector(".game-modal"); // Modalul de final al jocului
const playAgainBtn = gameModal.querySelector("button"); // Butonul de rejucare

// Inițializarea variabilelor jocului
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6; // Numărul maxim de ghiciri greșite permise

// Funcție pentru resetarea jocului
const resetGame = () => {
    // Resetarea variabilelor și elementelor UI
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg"; // Imaginea initială a omului atârnat
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; // Afișarea numărului de ghiciri greșite
    // Inițializarea afișării cuvântului
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    // Deblocarea butoanelor de la tastatură
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    // Ascunderea modalului de final
    gameModal.classList.remove("show");
}

// Funcție pentru a obține un cuvânt aleatoriu
const getRandomWord = () => {
    // Selectarea unui cuvânt și a unui indiciu aleator din wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word; // Salvarea cuvântului ales
    document.querySelector(".hint-text b").innerText = hint; // Afișarea indiciului
    resetGame(); // Resetarea jocului
}

// Funcție pentru gestionarea finalului jocului
const gameOver = (isVictory) => {
    // Afișarea modalului cu informațiile relevante
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show"); // Afișarea modalului
}

// Funcție pentru gestionarea începutului jocului
const initGame = (button, clickedLetter) => {
    // Verificarea dacă litera apăsată se află în cuvântul curent
    if(currentWord.includes(clickedLetter)) {
        // Afișarea tuturor literelor corecte pe ecran
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter); // Adăugarea literei corecte în vectorul de litere corecte
                wordDisplay.querySelectorAll("li")[index].innerText = letter; // Afișarea literei corecte
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed"); // Adăugarea clasei "guessed" pentru stilizare
            }
        });
    } else {
        // În caz contrar, actualizarea numărului de ghiciri greșite și a imaginii de spanzurătoare
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true; // Dezactivarea butonului apăsat pentru a nu mai putea fi apăsat din nou
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; // Afișarea numărului de ghiciri greșite

    // Apelarea funcției gameOver dacă una dintre aceste condiții este îndeplinită
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Crearea butoanelor pentru tastatură și adăugarea ascultătorilor de evenimente
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

// Obținerea unui cuvânt aleatoriu la începutul jocului
getRandomWord();
// Adăugarea unui ascultător de eveniment pentru butonul de rejucare
playAgainBtn.addEventListener("click", getRandomWord);
