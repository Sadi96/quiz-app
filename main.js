// QUIZ DATA
let quizData;
fetch('quiz-data.json')
.then(res => res.json())
.then(data => {
  quizData = data.questions
})
.catch(err => console.error(err));

// DOM VARIABLES
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

// GAME DATA VARIABLES
let allQuestionsInGame = 10;
let timerMinutesAmount = 0;
let timerSecondsAmount = 10;
let correctAnswersCounter = 0;
let wrongAnswersCounter = 0;
let questionCounter = 1;
let remainQuestionsCounter = allQuestionsInGame - 1;
let currentRoundQuizData = '';
let usedQuestionsIndexes = [];
let timerMinutesCounter = timerMinutesAmount;
let timerSecondsCounter = timerSecondsAmount;
let timerIntervalFunctionId = '';

// GAME CONTROL FUNCTIONS
// "NEW GAME" FUNCTION
function startNewGame() {
   button.removeEventListener('click', startNewGame);
   quizInitialization();
}

// "END OF GAME" FUNCTIONS
function checkEndGame() {
    if(questionCounter > allQuestionsInGame) {
        return true;
    } else {
        false;
    }
}

function hideQuizData() {
    questionNumberSpan.textContent = '-';
    remainingQuestionsSpan.textContent = '--';
    answerSpans.forEach(span => span.textContent = '---');
    minutesCounter.textContent = '--';
    secondsCounter.textContent = '--';
    questionParagraph.innerHTML = `Naciśnij przycisk na dole ekranu, aby rozpocząć grę`;
    button.style.display = 'block';
    button.textContent = 'Zacznij nową grę';
    button.addEventListener('click', startNewGame);
}

function clearVariables() {
    correctAnswersCounter = 0;
    wrongAnswersCounter = 0;
    questionCounter = 1;
    remainQuestionsCounter = allQuestionsInGame - 1;
    currentRoundQuizData = '';
    usedQuestionsIndexes.length = 0;
}

function closeResultsInfo() {
    quizAppBox.classList.remove('blurred');
    messageBox.classList.remove('visible');
    messageParagraph.innerHTML = ``;
    clearVariables();
    displayAnswersCounters();
    messageButton.removeEventListener('click', closeResultsInfo);
}

function displayResultsInfo() {
    quizAppBox.classList.add('blurred');
    messageBox.classList.add('visible');
    messageParagraph.innerHTML =
    `Koniec gry! <br /><br />
    Twój wynik to: <br />
    ${correctAnswersCounter} prawidłowych <br />
    ${wrongAnswersCounter} nieprawidłowych
    `;
    messageButton.addEventListener('click', closeResultsInfo);
}

function endGame() {
    answerBoxes.forEach(box => box.removeEventListener('click', sendAnswerWrapper));
    clearAnswerBoxesBackground();
    hideQuizData();
    displayResultsInfo();
    removeHoverFromButtons();
}

// "NEXT ROUNDS" FUNCTIONS
function startNextRound() {
    updateCounters()
    if(checkEndGame()) {
        return endGame()
    }
    clearAnswerBoxesBackground();
    displayCurrentCounters();
    const quizData = drawQuizData();
    displayQuizData(quizData);
    addHoverToButtons();
    answerBoxes.forEach(box => box.addEventListener('click', sendAnswerWrapper));
    timerIntervalFunctionId = setInterval(countTime, 1000);
}

function removeHoverFromButtons() {
    answerBoxes.forEach(box => {
        box.classList.remove('game-started');
    })
}

function clearAnswerBoxesBackground() {
    answerBoxes.forEach(box => {
        box.classList.remove('correct');
        box.classList.remove('wrong');
        box.classList.remove('checked');
    })
}

function updateCounters() {
    questionCounter++;
    remainQuestionsCounter--;
}

// INITIALIZING FUNCTIONS
function addHoverToButtons() {
    answerBoxes.forEach(box => {
        box.classList.add('game-started');
    })
}

function hideButton() {
    button.style.display = 'none';
}

function displayCurrentCounters() {
    displayCurrectTimer();
    displayAnswersCounters();
    displayQuestionCounters();
}

function drawQuizData() {
    let index = Math.floor(Math.random() * quizData.length);
    if(usedQuestionsIndexes.length === quizData.length) {
        throw new Error('There is no more available questions in database')
    }
    else if(usedQuestionsIndexes.includes(index)) {
        return drawQuizData();
    } else if(!usedQuestionsIndexes.includes(index)) {
        usedQuestionsIndexes.push(index);
        return quizData[index];
    }
}

function displayQuizData(quizData) {
    currentRoundQuizData = quizData;
    questionParagraph.textContent = quizData.question;
    answerSpans.forEach((span, index) => {
        span.textContent = quizData.answers[index]
    })
}

function displayCurrectTimer() {
    minutesCounter.textContent = timerMinutesCounter < 10 ? `0${timerMinutesCounter}` : timerMinutesCounter;
    secondsCounter.textContent = timerSecondsCounter < 10 ? `0${timerSecondsCounter}` : timerSecondsCounter;
}

function displayAnswersCounters() {
    correctAnswersSpan.textContent = correctAnswersCounter;
    wrongAnswersSpan.textContent = wrongAnswersCounter;
}

function displayQuestionCounters() {
    questionNumberSpan.textContent = questionCounter;
    remainingQuestionsSpan.textContent = remainQuestionsCounter;
}

function hideMessage() {
    quizAppBox.classList.remove('blurred');
    messageBox.classList.remove('visible');
    messageParagraph.textContent = '';
    messageButton.removeEventListener('click', hideMessage);
    startNextRound();
}

function displayMessage(message) {
    quizAppBox.classList.add('blurred');
    messageBox.classList.add('visible');
    messageParagraph.textContent = message;
    messageButton.addEventListener('click', hideMessage);
}

function correctAnswerAlert() {
    const choosenAnswer = answerBoxes.filter(box => box.classList.contains('checked'))[0];
    choosenAnswer.classList.remove('checked');
    choosenAnswer.classList.add('correct');
    correctAnswersCounter++;
    displayCurrentCounters();
    setTimeout(startNextRound, 1000)
}

function wrongAnswerAlert() {
    const choosenAnswer = answerBoxes.filter(box => box.classList.contains('checked'))[0];
    const correctAnswer = answerBoxes.filter(box => box.querySelector('.answer').textContent === currentRoundQuizData.correctAnswer)[0];
    choosenAnswer.classList.remove('checked');
    choosenAnswer.classList.add('wrong');
    setTimeout(() => {
        correctAnswer.classList.add('correct');
    }, 1000)
    wrongAnswersCounter++;
    displayCurrentCounters();
    setTimeout(startNextRound, 2000)
}

function sendAnswer(quizData) {
    this.classList.add('checked');
    removeHoverFromButtons();
    clearInterval(timerIntervalFunctionId);
    resetTimer();
    answerBoxes.forEach(box => box.removeEventListener('click', sendAnswerWrapper))
    const choosenAnswer = this.querySelector('.answer').textContent;
    if(choosenAnswer === quizData.correctAnswer) {
        setTimeout(correctAnswerAlert, 2000)
    } else if (choosenAnswer !== quizData.correctAnswer) {
        setTimeout(wrongAnswerAlert, 2000)
    }
}

function sendAnswerWrapper() {
    sendAnswer.bind(this)(currentRoundQuizData)
}

function resetTimer() {
    timerSecondsCounter = timerSecondsAmount;
}

function timedOut() {
    clearInterval(timerIntervalFunctionId);
    wrongAnswersCounter++;
    displayAnswersCounters();
    answerBoxes.forEach(box => box.classList.add('wrong'));
    resetTimer()
    setTimeout(() => displayMessage('Czas minął!'), 1000);
}

function countTime() {
timerSecondsCounter--;
displayCurrentCounters();
if(timerSecondsCounter === 0) {
    return timedOut();
}
}

function quizInitialization() {
    button.removeEventListener('click', quizInitialization);
    addHoverToButtons();
    hideButton();
    displayCurrentCounters();
    const quizData = drawQuizData();
    displayQuizData(quizData);
    answerBoxes.forEach(box => box.addEventListener('click', sendAnswerWrapper));
    timerIntervalFunctionId = setInterval(countTime, 1000);
}

// EVENT LISTENERS
button.addEventListener('click', quizInitialization);