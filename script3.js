const API_KEY = 'qa_sk_a9e0e3b9830bc3eb76cdbfa5facfc67822f98b91'; // <-- PASTE YOUR QUIZAPI KEY HERE
let quizData = []; // Will hold the raw data directly from the API

const quizContainer = document.getElementById('quiz');
const answerElements = document.querySelectorAll('.ans');
const questionElement = document.getElementById('question');
const timeElement = document.getElementById('time');
const submitBtn = document.getElementById('submit');

// Strictly 4 options now
const labels = {
    a: document.getElementById('opt1'),
    b: document.getElementById('opt2'),
    c: document.getElementById('opt3'),
    d: document.getElementById('opt4')
};

let currentQuizIndex = 0;
let score = 0;
let timeLeft = 10; 
let timerInterval;

async function fetchQuestions() {
    questionElement.innerText = "Loading questions... Please wait.";
    submitBtn.disabled = true;

    try {
        const response = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&limit=5&tags=javascript`);
        
        // Save the raw API response directly into our array
        quizData = await response.json();
        
        loadQuiz();

    } catch (error) {
        console.error("Error fetching questions:", error);
        questionElement.innerText = "Failed to load questions. Check your API key or connection.";
    }
}

function startTimer() {
    timeLeft = 10;
    timeElement.innerText = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timeElement.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            processAnswer(null); 
        }
    }, 1000);
}

function loadQuiz() {
    deselectAnswers();
    resetColors();
    submitBtn.disabled = false; 
    
    const currentQ = quizData[currentQuizIndex];
    questionElement.innerText = currentQ.question;
    
    // Read directly from the API's 'answers' object
    labels.a.innerText = currentQ.answers.answer_a;
    labels.b.innerText = currentQ.answers.answer_b;
    labels.c.innerText = currentQ.answers.answer_c;
    labels.d.innerText = currentQ.answers.answer_d;

    // Check if an option is null (sometimes the API only gives 2 or 3 options for True/False questions)
    ['a', 'b', 'c', 'd'].forEach(opt => {
        if (currentQ.answers[`answer_${opt}`]) {
            labels[opt].parentElement.style.display = 'block';
        } else {
            labels[opt].parentElement.style.display = 'none'; // Hide if no answer text exists
        }
    });

    startTimer();
}

function deselectAnswers() {
    answerElements.forEach(answerEl => {
        answerEl.checked = false;
        answerEl.disabled = false; 
    });
}

function resetColors() {
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
    clearInterval(timerInterval); 
    submitBtn.disabled = true;    
    
    answerElements.forEach(answerEl => answerEl.disabled = true);

    const currentQ = quizData[currentQuizIndex];
    let correctAns = null;

    // Loop through A, B, C, D to find which one is marked true in the API's 'correct_answers' object
    ['a', 'b', 'c', 'd'].forEach(opt => {
        if (currentQ.correct_answers[`answer_${opt}_correct`] === "true") {
            correctAns = opt;
            labels[opt].parentElement.classList.add('correct-ans'); // Highlight the correct answer in green
        }
    });

    // Check the user's answer against the correct answer
    if (userAnswer === correctAns) {
        score++;
    } else if (userAnswer !== null && labels[userAnswer]) {
        labels[userAnswer].parentElement.classList.add('incorrect-ans'); // Highlight wrong guess in red
    }

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

submitBtn.addEventListener('click', () => {
    const answer = getSelectedAnswer();
    
    if (answer) {
        processAnswer(answer);
    } else {
        alert("Please select an answer before submitting!");
    }
});

// Start the quiz by fetching data
fetchQuestions();