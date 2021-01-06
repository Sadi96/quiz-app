// BAZA PYTAŃ
// const quizData = [
//     {
//         question: 'Sport wodny uprawiany na desce z żaglem to',
//         answers: ['Skateboard', 'Surfing', 'Windsurfing', 'Bojery'],
//         correctAnswer: 'Windsurfing'
//     }, {
//         question: 'Urządzenie służące do nagrywania i odtwarzania wiadomości w telefonie komórkowym to',
//         answers: ["Toner", "Faks", "Poczta głosowa", "Poczta elektroniczna"],
//         correctAnswer: 'Poczta głosowa'
//     }, {
//         question: 'Powłoka na naczyniach kuchennych zapobiegająca przywieraniu potraw to',
//         answers: ["poliester", "teflon", "akryl", "winyl"],
//         correctAnswer: 'teflon'
//     }, {
//         question: 'Bohaterem jakiej powieści Henryka Sienkiewicza jest Jurand ze Spychowa?',
//         answers: ["„W pustyni i w puszczy”","„Quo Vadis”", "„Potop”", "„Krzyżacy”"],
//         correctAnswer: '„Krzyżacy”'
//     }, {
//         question: 'Napój Anglików pijany tradycyjnie o piątej po południu to',
//         answers: ["oranżada", "kakao", "herbata", "whisky"],
//         correctAnswer: 'herbata'
//     }, {
//         question: 'Wywar rosołowy to',
//         answers: [ "bulion",
//         "żur",
//         "wassersuppe",
//         "bulion Ureya"],
//         correctAnswer: 'bulion'
//     }, {
//         question: 'Daszek z wyciągiem umieszczony nad kuchnią, służący do usuwania zapachów na zewnątrz to',
//         answers: ["lufcik",
//         "wywietrznik",
//         "okap",
//         "szyber"],
//         correctAnswer: 'okap'
//     }, {
//         question: 'Jakie urządzenie służy do wykrywania, zapisywania i badania trzęsień ziemi?',
//         answers: ["polarymetr",
//         "aerograf",
//         "spektrometr",
//         "sejsmograf"],
//         correctAnswer: 'sejsmograf'
//     }, {
//         question: 'Kto był gospodarzem Mistrzostw Europy w piłce nożnej w 2000 roku ?',
//         answers: [ "Francja",
//         "Włochy",
//         "Holandia i Belgia",
//         "Niemcy"],
//         correctAnswer: 'Holandia i Belgia'
//     }, {
//         question: 'Twórcą jakiego imperium był Czyngis-chan?',
//         answers: ["japońskiego",
//         "chińskiego",
//         "tatarskiego",
//         "mongolskiego"],
//         correctAnswer: 'mongolskiego'
//     }, {
//         question: 'Pulchne placki drożdżowe smażone na oleju to:',
//         answers: ["knedle",
//         "naleśniki",
//         "racuchy",
//         "podpłomyki"],
//         correctAnswer: 'racuchy'
//     }, {
//         question: 'Który z wymienionych metali wykorzystywany jest w termometrach?',
//         answers: ["rubid ",
//         "rod ",
//         "rtęć",
//         "ruten "],
//         correctAnswer: 'rtęć'
//     }, {
//         question: 'Statek wodny, na którego pokładzie mogą startować i lądować samoloty to',
//         answers: ["tankowiec ",
//         "krążownik ",
//         "niszczyciel ",
//         "lotniskowiec"],
//         correctAnswer: 'lotniskowiec'
//     }, {
//         question: 'Czworokąt, którego wszystkie boki są równe oraz wszystkie kąty proste to:',
//         answers: [ "prostokąt ",
//         "kwadrat",
//         "romb ",
//         "trapez "],
//         correctAnswer: 'kwadrat'
//     }, {
//         question: 'Gorące źródło wyrzucające w regularnych odstępach czasu wodę i parę wodną to',
//         answers: ["wulkan",
//         "gejzer",
//         "bojler",
//         "źródło artezyjskie"],
//         correctAnswer: 'gejzer'
//     }, {
//         question: 'Uszy którego ze zwierząt w gwarze myśliwskiej nazywane są „słuchami”?',
//         answers: ["tarpana",
//         "żaby",
//         "sarny",
//         "zająca"],
//         correctAnswer: 'zająca'
//     }
// ]
let quizData;
fetch('quiz-data.json')
.then(res => res.json())
.then(data => {
  quizData = data.questions
})
.catch(err => console.error(err));

// ZMIENNE DOM
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

function sendAnswer(quizData) {
    let choosenAnswer = answerBoxes.filter(box => box.classList.contains('checked'));
        if(!choosenAnswer.length) {
            return alert('Najpierw zaznacz odpowiedź');
        } else if (choosenAnswer[0].querySelector('.answer').textContent === quizData.correctAnswer) {
            alert(`${choosenAnswer[0].querySelector('.answer').textContent} to dobra odpowiedź!`);
            correctAnswersCounter++;
            displayCurrentCounters();
        } else if (choosenAnswer[0].querySelector('.answer').textContent !== quizData.correctAnswer) {
            alert(`${choosenAnswer[0].querySelector('.answer').textContent} to nieprawidłowa odpowiedź!`)
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