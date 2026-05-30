// quiz logic assumes the quiz has been unlocked (all codewords found)


function getInsectDataByImage(imgSrc) {
    return keyvalues.find(item => item.fullimgsrc === imgSrc);
}

const questions = [
    {
        fullimgsrc: "images/ivy-bee-fullcolour-hex.svg",
        question: "In which season does ivy produce the most flowers, loved by <i>ivy bees</i>?",
        answers: [
            { text: "Autumn e.g. September to November", correct: true },
            { text: "Spring e.g. March to May", correct: false },
            { text: "Summer e.g. June to August", correct: false },
            { text: "Winter e.g. December to February", correct: false }
        ],
        feedback: { correct: "Bee-autiful!", incorrect: "Wrong season" }
    },
    {
        fullimgsrc: "images/lesser-stag-beetle-fullcolour-hex.svg",
        question: "Which of these piles would be the most help to <i>lesser stag beetles</i>?",
        answers: [
            { text: "Untreated wood", correct: true },
            { text: "Loamy soil", correct: false },
            { text: "Food scraps", correct: false },
            { text: "Deer droppings", correct: false }
        ],
        feedback: { correct: "Nice work!", incorrect: "That's not right" }
    },
    {
        fullimgsrc: "images/green-shield-bug-fullcolour-hex.svg",
        question: "Where do <i>green shield bugs</i> like to lay their eggs?",
        answers: [
            { text: "On the underside of leaves", correct: true },
            { text: "Deep under the ground", correct: false },
            { text: "Near shallow fresh water", correct: false },
            { text: "Inside medieval armour", correct: false }
        ],
        feedback: { correct: "Egg-cellent!", incorrect: "Not this one" }
    },
    {
        fullimgsrc: "images/darter-dragonfly-fullcolour-hex.svg",
        question: "What are juveniles of the <i>common darter dragonfly</i> called?",
        answers: [
            { text: "Nymphs", correct: true },
            { text: "Griffins", correct: false },
            { text: "Wyverns", correct: false },
            { text: "Pixies", correct: false }
        ],
        feedback: { correct: "Awesome!", incorrect: "Alas, no" }
    },
    {
        fullimgsrc: "images/marmalade-hoverfly-fullcolour-hex.svg",
        question: "What is the favourite food of <i>marmalade hoverfly</i> larvae?",
        answers: [
            { text: "Aphids", correct: true },
            { text: "Compost", correct: false },
            { text: "Jam", correct: false },
            { text: "Ants", correct: false }
        ],
        feedback: { correct: "Sweet!", incorrect: "Not quite" }
    },
    {
        fullimgsrc: "images/mint-moth-fullcolour-hex.svg",
        question: "Why do <i>mint moths</i> have this name?",
        answers: [
            { text: "The caterpillars feed on herbs including mint", correct: true },
            { text: "The adults make a minty smell when disturbed", correct: false },
            { text: "The adults sometimes steal breath mints", correct: false },
            { text: "The caterpillars are a minty green colour", correct: false }
        ],
        feedback: { correct: "You got it!", incorrect: "Sadly not" }
    }
];

// DOM selectors
const questionElement = document.getElementById("quiz-question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("quiz-next-btn");
const quizApp = document.getElementById("quiz-app");
const feedbackElement = document.getElementById("quiz-feedback-text");
const hexieText = document.querySelector("#quiz-hexie-help .hexie-text");


// 12 possible answer combinations to pick between randomly.
const questionOrders = [
    [2, 0, 5, 1, 4, 3], [4, 1, 3, 5, 0, 2], [1, 5, 0, 4, 3, 2], [3, 2, 1, 0, 5, 4],
    [5, 4, 2, 3, 1, 0], [0, 3, 4, 2, 5, 1], [1, 0, 5, 3, 4, 2], [4, 2, 0, 1, 3, 5],
    [3, 5, 1, 4, 2, 0], [5, 1, 3, 0, 2, 4], [2, 4, 0, 5, 1, 3], [0, 5, 2, 3, 4, 1]
];


// 12 possible different combinations, 3 where 1 is first, 3 where 1 is second and so on. 1 is always correct here, so it's evenly balanced
const answerOrders = [
    [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3],
    [3, 0, 2, 1], [2, 0, 1, 3], [3, 0, 1, 2],
    [1, 2, 0, 3], [2, 1, 0, 3], [1, 3, 0, 2],
    [1, 2, 3, 0], [1, 2, 3, 0], [3, 2, 1, 0]
];


let currentQuestionIndex = 0;
let score = 0;

// pick random set of question and answer orders at start of quiz
let selectedQuestionOrder = [];
let selectedAnswerOrder = [];

let userResults = [];


let quizState = "front"; // "front" = front page, "inProgress" = quiz active


function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;

    if (quizState === "front") {
        hexieText.innerHTML = "<p>You have completed the Creature Seekers trail!</p><p>You can now start the quiz on all the insects you found.</p><p>Hexie hint: All the answers can be found within the Profiles page!</p>";

        resetState();
        nextButton.disabled = false;
        nextButton.innerHTML = "Start quiz!";
    }
};

function showQuestion() {
    resetState();
    let currentQuestion = questions[selectedQuestionOrder[currentQuestionIndex]];
    selectedAnswerOrder = answerOrders[Math.floor(Math.random() * answerOrders.length)];
    let questionNo = currentQuestionIndex + 1;

    // clear results container
    const resultsContainer = document.getElementById("quiz-results");
    resultsContainer.innerHTML = "";
    resultsContainer.classList.add("hidden");

    // write question text with number
    questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

    const quizImage = document.querySelector("#quiz-question-img img");
    quizImage.src = currentQuestion.fullimgsrc;


    // generate the answer buttons
    // loop through answers in the selected random order
    selectedAnswerOrder.forEach(i => {
        let answer = currentQuestion.answers[i];
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("quiz-option-btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    })

    // Update Next button text
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.innerHTML = "Finish!";
    } else {
        nextButton.innerHTML = "Next";
    }
}

// removes other questions
function resetState() {
    const hexieFace = document.getElementById("quiz-feedback-hexie")

    // clear results container
    const resultsContainer = document.getElementById("quiz-results");
    resultsContainer.innerHTML = "";
    resultsContainer.classList.add("hidden");

    // keep Next button always visible but disabled
    nextButton.disabled = true;

    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild)
    }
    // hide feedback and remove classes
    feedbackElement.textContent = "";
    feedbackElement.classList.remove("correct", "incorrect", "show");

    hexieFace.innerHTML = "<img src='images/quiz-hexie-neutral.svg' alt='' width='42' height='42'>";
}





function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    const hexieFace = document.getElementById("quiz-feedback-hexie");


    // adds the coloration etc based on correctness
    if (isCorrect) {
        selectedBtn.classList.add("quiz-correct");

        score += 1;
    } else {
        selectedBtn.classList.add("quiz-incorrect");
    }

    // add the relevant feedback
    let currentQuestion = questions[selectedQuestionOrder[currentQuestionIndex]];
    let insectData = getInsectDataByImage(currentQuestion.fullimgsrc);

    // store result
    userResults.push({
        name: insectData ? insectData.fullname : "Unknown insect",
        img: currentQuestion.fullimgsrc,
        correct: isCorrect,
        feedback: isCorrect
            ? currentQuestion.feedback.correct
            : currentQuestion.feedback.incorrect
    });

    feedbackElement.classList.remove("correct", "incorrect", "show");

    if (isCorrect) {
        feedbackElement.textContent = currentQuestion.feedback.correct;
        feedbackElement.classList.add("correct");
        hexieFace.innerHTML = "<img src='images/quiz-hexie-correct.svg' alt='' width='42' height='42'>";
    } else {
        feedbackElement.textContent = currentQuestion.feedback.incorrect;
        feedbackElement.classList.add("incorrect");
        hexieFace.innerHTML = "<img src='images/quiz-hexie-incorrect.svg' alt='' width='42' height='42'>";
    }

    // fade in
    requestAnimationFrame(() => {
        feedbackElement.classList.add("show");
    });

    // automatically mark and style the options after answering
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("quiz-correct", "pulse");
            setTimeout(() => button.classList.remove("pulse"), 500);
        }

        if (button !== selectedBtn && !button.classList.contains("quiz-correct")) {
            button.classList.add("dimmed"); // grey out unselected, incorrect buttons
        }
        // stops further clicking on button
        button.disabled = true;
    });
    // enable Next button
    nextButton.disabled = false;
}



// display either the question, or the score
function handleNextButton() {
    if (quizState === "front") {

        // hide hexie intro
        // show quiz elements when quiz begins
        quizApp.classList.remove("quiz-front", "quiz-end");
        quizApp.classList.add("quiz-active");

        // move from front page to quiz
        quizState = "inProgress";
        currentQuestionIndex = 0;

        // pick random question order 
        selectedQuestionOrder = questionOrders[Math.floor(Math.random() * questionOrders.length)];

        score = 0;
        userResults = [];
        nextButton.innerHTML = "Next";
        showQuestion();
        return;
    }

    // normal quiz progression
    currentQuestionIndex += 1;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
        quizState = "front"; // allow "Play Again"
        nextButton.innerHTML = "Play again!";
        nextButton.disabled = false;
    }
}


function showScore() {
    resetState();
    // change quiz state
    quizApp.classList.remove("quiz-active");
    quizApp.classList.add("quiz-end");

    const resultsContainer = document.getElementById("quiz-results");

    // Hexie message
    scoreMessage = `<p>You scored:</p><h2>${score} out of ${questions.length}</h2></p>`

    if (score === questions.length) {
        scoreMessage += "<p>Amazing, top score! Now go and see what creatures you can seek out and help in your local area. Good luck!</p>";
    } else if (score === questions.length - 1) {
        scoreMessage += "<p>Nearly there! Check out the Profiles page to see what you missed, and try again!</p>";
    } else if (score > questions.length / 2) {
        scoreMessage += "<p>Over half way! Check out the Profiles page to see what you missed, and try again!</p>";
    } else if (score === 0) {
        scoreMessage += "<p>You can do it! Check out the Profiles page to find the answers, and try again!</p>";
    } else {
        scoreMessage += "<p>Partly right! Check out the Profiles page to see what you missed, and try again!</p>";
    }

    // build results cards
    let cardsHTML = `<div class="results-cards">`;

    userResults.forEach((result, index) => {
        const delay = 0.3 + (index * 0.22); // 0.5s initial pause, then stagger

        cardsHTML += `
                <div class="result-card ${result.correct ? "correct" : "incorrect"}"
             style="animation-delay: ${delay}s">
                    
                    <img src="${result.img}" alt="${result.name}" class="result-img">

                    <div class="result-text">
                        <h3 class="result-name"> ${result.name} question:</h3>
                        <p class="result-feedback">${result.feedback}</p>
                    </div>

                    <div class="result-icon" aria-label="${result.correct ? "Correct" : "Incorrect"}">
                        ${result.correct ? "✔" : "✖"}
                    </div>
                </div>
            `;
    });

    cardsHTML += `</div>`;


    resultsContainer.innerHTML = cardsHTML;
    resultsContainer.classList.remove("hidden");

    // trigger staggered animation
    setTimeout(() => {
        document.querySelectorAll(".result-card").forEach(card => {
            card.classList.add("show");
        });
    }, 50);

    if (score === questions.length) {
        setTimeout(() => {
            triggerConfetti("large");
        }, 600);
    }

    // update what Hexie says, and the button
    hexieText.innerHTML = scoreMessage;
    nextButton.innerHTML = "Play again!";

    // reset image back to mystery hex
    const quizImage = document.querySelector("#quiz-question-img img");
    quizImage.src = "images/mystery-bug-animation-hex.svg";

    // enable the button so user can click it
    nextButton.disabled = false;
}


// click handler for Next button
nextButton.addEventListener("click", handleNextButton);

startQuiz();