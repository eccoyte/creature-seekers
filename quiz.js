// quiz logic assumes the quiz has been unlocked (all codewords found)

const questions = [
    {
        imgsrc: "images/ivy-bee-animation-hex.svg",
        question: "In which season does ivy produce the most flowers, loved by <i>ivy bees</i>?",
        answers: [
            {text: "Autumn e.g. September to November", correct: true},
            {text: "Spring e.g. March to May", correct: false},
            {text: "Summer e.g. June to August", correct: false},
            {text: "Winter e.g. December to February", correct: false}
        ],
        feedback: {correct: "Bee-autiful!", incorrect: "Incorrect"}
    },
    {
        imgsrc: "images/lesser-stag-beetle-animation-hex.svg",
        question: "Which of these piles would be the most help to <i>lesser stag beetles</i>?",
        answers: [
            {text: "Untreated wood", correct: true},
            {text: "Loamy soil", correct: false},
            {text: "Food scraps", correct: false},
            {text: "Deer droppings", correct: false}
        ],
        feedback: {correct: "Nice work!", incorrect: "That's not right"}
    },
    {
        imgsrc: "images/green-shield-bug-animation-hex.svg",
        question: "Where do <i>green shield bugs</i> like to lay their eggs?",
        answers: [
            {text: "On the underside of leaves", correct: true},
            {text: "Deep under the ground", correct: false},
            {text: "Near shallow fresh water", correct: false},
            {text: "Inside medieval armour", correct: false}
        ],
        feedback: {correct: "Egg-cellent!", incorrect: "Not this one"}
    },
    {
        imgsrc: "images/darter-dragonfly-animation-hex.svg",
        question: "What are juveniles of the <i>common darter dragonfly</i> called?",
        answers: [
            {text: "Nymphs", correct: true},
            {text: "Griffins", correct: false},
            {text: "Wyverns", correct: false},
            {text: "Pixies", correct: false}
        ],
        feedback: {correct: "Awesome!", incorrect: "Sadly not"}
    },
    {
        imgsrc: "images/marmalade-hoverfly-animation-hex.svg",
        question: "What is the favourite food of <i>marmalade hoverfly</i> larvae?",
        answers: [
            {text: "Aphids", correct: true},
            {text: "Compost", correct: false},
            {text: "Jam", correct: false},
            {text: "Ants", correct: false}
        ],
        feedback: {correct: "Sweet!", incorrect: "Sadly not"}
    },
    {
        imgsrc: "images/mint-moth-animation-hex.svg",
        question: "Why do <i>mint moths</i> have this name?",
        answers: [
            {text: "The caterpillars feeds on herbs including mint", correct: true},
            {text: "The adults create a minty smell when disturbed", correct: false},
            {text: "The adults sometimes steal breath mints", correct: false},
            {text: "The caterpillars are a minty green colour", correct: false}
        ],
        feedback: {correct: "You got it!", incorrect: "Unfortunately not"}
    }
];

const questionElement = document.getElementById("quiz-question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("quiz-next-btn");



// this is suboptimal but good enough for this purpose. 12 possible combinations, to pick between. Unlikely to get same twice!
const questionOrders = [
    [2, 0, 5, 1, 4, 3], [4, 1, 3, 5, 0, 2], [1, 5, 0, 4, 3, 2], [3, 2, 1, 0, 5, 4], 
    [5, 4, 2, 3, 1, 0], [0, 3, 4, 2, 5, 1], [1, 0, 5, 3, 4, 2], [4, 2, 0, 1, 3, 5], 
    [3, 5, 1, 4, 2, 0], [5, 1, 3, 0, 2, 4], [2, 4, 0, 5, 1, 3], [0, 5, 2, 3, 4, 1]
];


//12 possible different combinations, 3 where 1 is first, 3 where 1 is second and so on. 1 is always correct here, so it's evenly balanced
const answerOrders = [
    [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3],
    [3, 0, 2, 1], [2, 0, 1, 3], [3, 0, 1, 2],
    [1, 2, 0, 3], [2, 1, 0, 3], [1, 3, 0, 2],
    [1, 2, 3, 0], [1, 2, 3, 0], [3, 2, 1, 0]
];

const feedbackElement = document.getElementById("quiz-feedback");

let currentQuestionIndex = 0;
let score = 0;

// pick random set of question and answer orders at start of quiz
let selectedQuestionOrder = [];
let selectedAnswerOrder = [];

// TO-DO: Generate randomised question order within the quiz, and use that going forward
// TO-DO: Generate randomised answer order within each question, and use that going forward.
// possible randomisation: "options = choices[matrix(shuffle(1:size(choices)[1]))];" but this only works when it's a straight list, currently it's an object
// could rework to answers: ["a", "b", "c", "d"], and correct is always the first one.

let quizState = "front"; // "front" = front page, "inProgress" = quiz active

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;

    if (quizState === "front") {
        // show front page message
        questionElement.innerHTML = "<p>Well done - you have completed the Creature Seekers trail!</p><p>You can now start the quiz on all the insects you found.</p>";
        
        resetState(); 
        nextButton.disabled = false; 
        nextButton.innerHTML = "Start Quiz";
    } 
};

function showQuestion() {
    resetState();
    let currentQuestion = questions[selectedQuestionOrder[currentQuestionIndex]];
    selectedAnswerOrder = answerOrders[Math.floor(Math.random() * answerOrders.length)];
    let questionNo = currentQuestionIndex + 1;
    
    // write question text with number
    questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

        const quizImage = document.querySelector("#quiz-question-img img");
    quizImage.src = currentQuestion.imgsrc;

    // generate the answer buttons
// loop through answers in the selected random order
    selectedAnswerOrder.forEach(i => {
        let answer = currentQuestion.answers[i]; 
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("quiz-option-btn");
        answerButtons.appendChild(button);
        if(answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        
    })
}

// removes other questions
function resetState() {
    
    // keep Next button always visible but disabled
    nextButton.disabled = true;

    while(answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild)
    }
    // hide feedback and remove classes
    feedbackElement.textContent = "";
    feedbackElement.classList.remove("correct", "incorrect", "show");
}





function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    // adds the coloration etc based on correctness
    if (isCorrect) {
        selectedBtn.classList.add("quiz-correct");
        score += 1;
    } else {
        selectedBtn.classList.add("quiz-incorrect");
    }
    
    // add the relevant feedback
    let currentQuestion = questions[selectedQuestionOrder[currentQuestionIndex]];

    feedbackElement.classList.remove("correct", "incorrect", "show");

    if (isCorrect) {
        feedbackElement.textContent = currentQuestion.feedback.correct;
        feedbackElement.classList.add("correct");
    } else {
        feedbackElement.textContent = currentQuestion.feedback.incorrect;
        feedbackElement.classList.add("incorrect");
    }

    // fade in
    requestAnimationFrame(() => {
        feedbackElement.classList.add("show");
    });

    // automatically mark the correct options after answering
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true") {
            button.classList.add("quiz-correct");
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
        // move from front page to quiz
        quizState = "inProgress";
        currentQuestionIndex = 0;

        // pick random question order 
        selectedQuestionOrder = questionOrders[Math.floor(Math.random() * questionOrders.length)];

        score = 0;
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
        nextButton.innerHTML = "Play Again";
        nextButton.disabled = false;
    }
}


function showScore() {
    resetState();
    scoreMessage = `<p>Your quiz score: ${score} out of ${questions.length}</p>`

    if (score == 0) {
        scoreMessage += "<p>Check out the creature profiles page to see what you missed, and try again!</p>"; 
    } else if (score < questions.length - 1) {
        scoreMessage += "<p>Partly right! Check out the creature profiles page to see what you missed, and try again!</p>"; 
    } else if (score = questions.length - 1) {
        scoreMessage += "<p>Nearly there! Check out the creature profiles page to see what you missed, and try again!</p>";
    } else {
        scoreMessage += "<p>Amazing, top score! Now go and see what creatures you can seek out and help in your local area. Good luck!</p>";
    }

    questionElement.innerHTML = scoreMessage;
    nextButton.innerHTML = "Play again";

    // reset image back to mystery hex
    const quizImage = document.querySelector("#quiz-question-img img");
    quizImage.src = "images/mystery-bug-animation-hex.svg"; 

    // enable the button so user can click it
    nextButton.disabled = false;
}


// click handler for Next button
nextButton.addEventListener("click", handleNextButton);

startQuiz();