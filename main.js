// BAZA PYTAŃ
let quizData;
fetch('quiz-data.json')
.then(res => res.json())
.then(data => {
  quizData = data.questions
})
.catch(err => console.error(err));

// ZMIENNE DOM
const quizAppBox = document.getElementById('quiz-app');
const correctAnswersSpan = document.getElementById('correct-counter');
const wrongAnswersSpan = document.getElementById('wrong-counter');
const minutesCounter = document.getElementById('minutes');
const secondsCounter = document.getElementById('seconds');
const questionNumberSpan = document.getElementById('question-number');
const remainingQuestionsSpan = document.getElementById('remaining-questions');
const questionParagraph = document.getElementById('question');
const answerBoxes = [...document.querySelectorAll('.answer-box')];
const answerSpans = document.querySelectorAll('span.answer');
const button = document.querySelector('#button button');
const messageBox = document.getElementById('message-box-wrapper');
const messageParagraph = document.getElementById('message-paragraph');
const messageButton = document.getElementById('message-button');

// ZMIENNE PRZECHOWUJĄCE DANE GRY
let allQuestionsInGame = 10;
let correctAnswersCounter = 0;
let wrongAnswersCounter = 0;
let questionCounter = 1;
let remainQuestionsCounter = allQuestionsInGame - 1;
let currentRoundQuizData = '';

// FUNKCJE STERUJĄCE GRĄ
// FUNKCJA ROZPOCZYNAJĄCE GRĘ OD NOWA
function clearVariables() {
    correctAnswersCounter = 0;
    wrongAnswersCounter = 0;
    questionCounter = 1;
    remainQuestionsCounter = allQuestionsInGame - 1;
    currentRoundQuizData = '';
}

function startNewGame() {
   clearVariables();
   button.removeEventListener('click', startNewGame);
   quizInitialization();
}

// KONIEC GRY
function displayGameResults() {
    questionNumberSpan.textContent = '-';
    remainingQuestionsSpan.textContent = '--';
    answerSpans.forEach(span => span.textContent = '---')
    questionParagraph.innerHTML = `Koniec gry! Twój wynik to: <br />
    Prawidłowo: ${correctAnswersCounter}<br/>
    Nieprawidłowo: ${wrongAnswersCounter}`;
    button.textContent = 'Zacznij nową grę';
    button.addEventListener('click', startNewGame);
}

function endGame() {
    displayGameResults();
}

// FUNKCJE NA KOLEJNE RUNDY
function startNextRound() {
    changeButtonText();
    const quizData = drawQuizData();
    displayQuizData(quizData);
    addHoverToButtons();
    answerBoxes.forEach(box => box.addEventListener('click', chooseAnswer));
    button.addEventListener('click', sendAnswerWrapper);
}

function removeHoverFromButtons() {
    answerBoxes.forEach(box => {
        box.classList.remove('game-started');
        box.classList.remove('checked');
    })
}

function clearGameActivity() {
    button.removeEventListener('click', sendAnswerWrapper);
    answerBoxes.forEach(box => box.removeEventListener('click', chooseAnswer));
    removeHoverFromButtons();
}

function updateCounters() {
    questionCounter++;
    remainQuestionsCounter--;
    if(questionCounter > allQuestionsInGame) {
        endGame();
    } else {
        displayCurrentCounters();
        startNextRound();
    }
}

// FUNKCJE INICJALIZUJĄCE
function addHoverToButtons() {
    answerBoxes.forEach(box => {
        box.classList.add('game-started');
    })
}

function changeButtonText() {
    button.textContent = 'Wybierz odpowiedź'
}

function displayCurrentCounters() {
    correctAnswersSpan.textContent = correctAnswersCounter;
    wrongAnswersSpan.textContent = wrongAnswersCounter;
    questionNumberSpan.textContent = questionCounter;
    remainingQuestionsSpan.textContent = remainQuestionsCounter;
}

function drawQuizData() {
    const index = Math.floor(Math.random() * quizData.length);
    return quizData[index];
}

function displayQuizData(quizData) {
    currentRoundQuizData = quizData;
    questionParagraph.textContent = quizData.question;
    answerSpans.forEach((span, index) => {
        span.textContent = quizData.answers[index]
    })
}

function chooseAnswer() {
    answerBoxes.forEach(box => box.classList.remove('checked'));
    this.classList.add('checked');
    button.textContent = 'Zatwierdź';
}

function hideMessage() {
    quizAppBox.classList.remove('blurred');
    messageBox.classList.remove('visible');
    messageParagraph.textContent = '';
    messageButton.removeEventListener('click', hideMessage);
}

function displayMessage(message) {
    quizAppBox.classList.add('blurred');
    messageBox.classList.add('visible');
    messageParagraph.textContent = message;
    messageButton.addEventListener('click', hideMessage);
}

function sendAnswer(quizData) {
    let choosenAnswer = answerBoxes.filter(box => box.classList.contains('checked'));
        if(!choosenAnswer.length) {
            return displayMessage('Najpierw zaznacz odpowiedź');
        } else if (choosenAnswer[0].querySelector('.answer').textContent === quizData.correctAnswer) {
            displayMessage(`${choosenAnswer[0].querySelector('.answer').textContent} to dobra odpowiedź!`);
            correctAnswersCounter++;
            displayCurrentCounters();
        } else if (choosenAnswer[0].querySelector('.answer').textContent !== quizData.correctAnswer) {
            displayMessage(`${choosenAnswer[0].querySelector('.answer').textContent} to nieprawidłowa odpowiedź!`)
            wrongAnswersCounter++;
            displayCurrentCounters();
        }
        clearGameActivity();
        updateCounters();
}

function sendAnswerWrapper() {
    sendAnswer(currentRoundQuizData)
}

function quizInitialization() {
    button.removeEventListener('click', quizInitialization);
    addHoverToButtons();
    changeButtonText();
    displayCurrentCounters();
    const quizData = drawQuizData();
    displayQuizData(quizData);
    answerBoxes.forEach(box => box.addEventListener('click', chooseAnswer));
    button.addEventListener('click', sendAnswerWrapper);
}

// EVENT LISTENERS
button.addEventListener('click', quizInitialization);