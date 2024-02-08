fetch('puzzle.json')
  .then(response => response.json())
  .then(data => {
    puzzle = data;
    initializeGame();
  })
  .catch(error => console.error('Error fetching puzzle data:', error));

const hint = document.querySelector('.hint');
const guessLeft = document.querySelector('.guess-left');
const wrongLetter = document.querySelector('.wrong-letter');
const buttonGuess = document.querySelector('.buttonn');
const inputsContainer = document.querySelector('.inputs');
const userInput = document.querySelector('#input-letter');

let chancesLeft = 10;
let wordIndex = 0;
let word = '';
let guessedChar = '';

const initializeGame = () => {
  if (wordIndex >= puzzle.length) {
    wordIndex = 0;
  }
  word = puzzle[wordIndex].word;
  hint.innerText = "Hint:"+puzzle[wordIndex].hint;
  adjustInputBoxes(word.length);
  chancesLeft = 10; 
  guessLeft.firstElementChild.innerText = chancesLeft;
  wrongLetter.firstElementChild.innerText = '';
  buttonGuess.style.visibility = "hidden";
  wordIndex++;
  userInput.disabled = false;
};

const adjustInputBoxes = (wordLength) => {
  inputsContainer.innerHTML = '';
  for (let i = 0; i < wordLength; i++) {
    let input = document.createElement('input');
    input.type = 'text';
    input.className = 'child';
    input.disabled = true;
    inputsContainer.appendChild(input);
  }
};

const handleInput = () => {
  if (userInput.value.length > 0) {
    guessedChar = userInput.value.toLowerCase();
    userInput.value = '';
    userInput.focus();
    checkGuess();
  }
};

const checkGuess = () => {
  if (chancesLeft === 0) {
    hint.innerText = "Better luck next time!";
    showButton("Play Again");
    return;
  }

  if (wrongLetter.firstElementChild.innerText.includes(guessedChar)) {
    return;
  }

  let indices = [];

  word.split('').forEach((char, index) => {
    if (char === guessedChar) {
      indices.push(index);
    }
  });

  chancesLeft--;
  guessLeft.firstElementChild.innerText = chancesLeft;

  if (indices.length > 0) {
    for (let index of indices) {
      inputsContainer.children[index].value = guessedChar;
    }
    const allLettersFilled = [...inputsContainer.children].every(input => input.value !== "");
    if (allLettersFilled) {
      hint.innerText = "You guessed it correctly!";
      if (wordIndex === puzzle.length - 1) {
        showButton("Play Again");
      } else {
        showButton("Next Word");
      }
    }
  } else {
    wrongLetter.firstElementChild.innerText += guessedChar + ', ';
    if (chancesLeft === 0) {
      inputsContainer.innerHTML = word.split('').join(' ');
      hint.innerText = "Better luck next time!";
      showButton("Play Again");
    }
  }
};


const showButton = (text) => {
  buttonGuess.style.visibility = "visible";
  buttonGuess.innerText = text;
  userInput.disabled = true;
};

const handleButtonClick = () => {
  chancesLeft = 10;
  guessedChar = '';
  wrongLetter.firstElementChild.innerText = '';
  initializeGame();
};

userInput.addEventListener('input', handleInput);
buttonGuess.addEventListener('click', handleButtonClick);
