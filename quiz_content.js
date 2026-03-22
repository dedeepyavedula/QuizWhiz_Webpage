// defining quiz data
const quizData = [
    {
        question: "What is the capital of France?",
        a: "Berlin",
        b: "Madrid",
        c: "Paris",
        d: "Lisbon",
        e: "Rome",
        correct: "c"
    },
    {
        question: "Which programming language is known as the language of the web?",
        a: "Python",
        b: "JavaScript",
        c: "C++",
        d: "Java",
        e: "Ruby",
        correct: "b"
    },
    {
        question: "What does HTML stand for?",
        a: "Hyper Text Preprocessor",
        b: "Hyper Text Multiple Language",
        c: "Hyper Tool Multi Language",
        d: "Hyper Text Markup Language",
        e: "High Text Machine Learning",
        correct: "d"
    }
];

// Grabbing the elements from the DOM 
const quizContainer = document.getElementById('quiz');
const answerElements = document.querySelectorAll('.ans');
const questionElement = document.getElementById('question');

const opt1 = document.getElementById('opt1');
const opt2 = document.getElementById('opt2');
const opt3 = document.getElementById('opt3');
const opt4 = document.getElementById('opt4');
const opt5 = document.getElementById('opt5');

const submitBtn = document.getElementById('submit');

// Keep track of the current question and score
let currentQuizIndex = 0;
let score = 0;

// Function to load the current question to the screen
function loadQuiz() {
    // Clear any previously selected radio buttons
    deselectAnswers();

    const currentQuizData = quizData[currentQuizIndex];

    // Inject the data into the HTML elements
    questionElement.innerText = currentQuizData.question;
    opt1.innerText = currentQuizData.a;
    opt2.innerText = currentQuizData.b;
    opt3.innerText = currentQuizData.c;
    opt4.innerText = currentQuizData.d;
    opt5.innerText = currentQuizData.e;
}

// Unchecking all radio buttons for the new question
function deselectAnswers() {
    answerElements.forEach(answerEl => answerEl.checked = false);
}

// Finding out which radio button the user clicked
function getSelectedAnswer() {
    let answer;
    answerElements.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id; // Will return 'a', 'b', 'c', 'd', or 'e'
        }
    });
    return answer;
}

// Load the very first question when the script runs
loadQuiz();

// 7. What happens when the user clicks "Submit"
submitBtn.addEventListener('click', () => {
    const answer = getSelectedAnswer();

    // Make sure the user actually selected an option before proceeding
    if (answer) {
        // If correct, increase the score
        if (answer === quizData[currentQuizIndex].correct) {
            score++;
        }

        // Move to the next question
        currentQuizIndex++;

        if (currentQuizIndex < quizData.length) {
            // Load the next question
            loadQuiz();
        } else {
            // End of quiz: overwrite the inner HTML to show the score
            quizContainer.innerHTML = `
                <h2 style="text-align: center; margin-bottom: 20px;">
                    You answered ${score}/${quizData.length} questions correctly!
                </h2>
                <div class="btn">
                    <button onclick="location.reload()">Reload Quiz</button>
                </div>
            `;
        }
    } else {
        alert("Please select an answer before submitting!");
    }
});