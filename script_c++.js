const quizData = [
    {
        question: "Which symbol is used to include libraries in C++?",
        a: "#include", b: "import", c: "using", d: "library",
        correct: "a"
    },
    {
        question: "Which function is the entry point of a C++ program?",
        a: "start()", b: "main()", c: "run()", d: "init()",
        correct: "b"
    },
    {
        question: "Which data type is used to store decimal numbers in C++?",
        a: "int", b: "char", c: "float", d: "bool",
        correct: "c"
    },
    {
        question: "Which operator is used for output in C++?",
        a: "<<", b: ">>", c: "::", d: "==",
        correct: "a"
    },
    {
        question: "Which keyword is used to define a constant in C++?",
        a: "final", b: "const", c: "constant", d: "define",
        correct: "b"
    }
];

const quizContainer = document.getElementById('quiz');
const answerElements = document.querySelectorAll('.ans');
const questionElement = document.getElementById('question');
const timeElement = document.getElementById('time');
const submitBtn = document.getElementById('submit');

const labels = {
    a: document.getElementById('opt1'),
    b: document.getElementById('opt2'),
    c: document.getElementById('opt3'),
    d: document.getElementById('opt4')
};

let currentQuizIndex = 0;
let score = 0;
let timeLeft = 10; // 10 seconds per question
let timerInterval;

function startTimer() {
    timeLeft = 10;
    timeElement.innerText = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timeElement.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            processAnswer(null); // Process as a wrong/skipped answer
        }
    }, 1000);
}

function loadQuiz() {
    deselectAnswers();
    resetColors();
    submitBtn.disabled = false; // Re-enable the submit button
    
    const currentQuizData = quizData[currentQuizIndex];
    questionElement.innerText = currentQuizData.question;
    labels.a.innerText = currentQuizData.a;
    labels.b.innerText = currentQuizData.b;
    labels.c.innerText = currentQuizData.c;
    labels.d.innerText = currentQuizData.d;

    startTimer();
}

function deselectAnswers() {
    answerElements.forEach(answerEl => {
        answerEl.checked = false;
        answerEl.disabled = false; // Re-enable radio buttons
    });
}

function resetColors() {
    // Remove the green/red backgrounds from the list items
    Object.values(labels).forEach(label => {
        label.parentElement.classList.remove('correct-ans', 'incorrect-ans');
    });
}

function getSelectedAnswer() {
    let answer;
    answerElements.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}

function processAnswer(userAnswer) {
    clearInterval(timerInterval); // Stop the clock
    submitBtn.disabled = true;    // Prevent double clicking
    
    // Disable all radio buttons so user can't click while waiting
    answerElements.forEach(answerEl => answerEl.disabled = true);

    const correctAns = quizData[currentQuizIndex].correct;

    // Highlight the correct answer in green
    labels[correctAns].parentElement.classList.add('correct-ans');

    if (userAnswer === correctAns) {
        score++;
    } else if (userAnswer !== null) {
        // If they guessed wrong, highlight their guess in red
        labels[userAnswer].parentElement.classList.add('incorrect-ans');
    }

    // Wait 2 seconds so the user can see the right answer, then move on
    setTimeout(() => {
        currentQuizIndex++;
        if (currentQuizIndex < quizData.length) {
            loadQuiz();
        } else {
            quizContainer.innerHTML = `
                <h2 style="text-align: center; margin-bottom: 20px;">
                    Quiz Complete!<br>You scored ${score}/${quizData.length}
                </h2>
                <div class="btn">
                    <button onclick="location.reload()">Restart Quiz</button>
                </div>
            `;
        }
    }, 2000);
}

// Event listener for the submit button
submitBtn.addEventListener('click', () => {
    const answer = getSelectedAnswer();
    
    if (answer) {
        processAnswer(answer);
    } else {
        alert("Please select an answer before submitting!");
    }
});

// Start the quiz
loadQuiz();