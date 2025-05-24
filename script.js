// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const scoreSpan = document.getElementById('score');
const finalScoreSpan = document.getElementById('final-score');
const maxScoreSpan = document.getElementById('max-score');
const resultMessage = document.getElementById('result-message');
const restartButton = document.getElementById('restart-btn');
const progressBarIndicator = document.getElementById('progress-indicator');

// Quiz questions
const quizQuestions = [
  {
    question: 'What is the capital of France?',
    answers: [
      { text: 'London', correct: false },
      { text: 'Berlin', correct: false },
      { text: 'Paris', correct: true },
      { text: 'Madrid', correct: false },
    ],
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answers: [
      { text: 'Venus', correct: false },
      { text: 'Mars', correct: true },
      { text: 'Jupiter', correct: false },
      { text: 'Saturn', correct: false },
    ],
  },
  {
    question: 'What is the largest ocean on Earth?',
    answers: [
      { text: 'Atlantic Ocean', correct: false },
      { text: 'Indian Ocean', correct: false },
      { text: 'Arctic Ocean', correct: false },
      { text: 'Pacific Ocean', correct: true },
    ],
  },
  {
    question: 'Which of these is NOT a programming language?',
    answers: [
      { text: 'Java', correct: false },
      { text: 'Python', correct: false },
      { text: 'Banana', correct: true },
      { text: 'JavaScript', correct: false },
    ],
  },
  {
    question: 'What is the chemical symbol for gold?',
    answers: [
      { text: 'Go', correct: false },
      { text: 'Gd', correct: false },
      { text: 'Au', correct: true },
      { text: 'Ag', correct: false },
    ],
  },
];

// Quiz State Variables
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Event Listeners
startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', restartQuiz);

function startQuiz() {
  //reset variables
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove('active');
  quizScreen.classList.add('active');

  showQuestion();
}

function showQuestion() {
  // reset state
  answersDisabled = false;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercentage =
    (currentQuestionIndex / quizQuestions.length) * 100;
  progressBarIndicator.style.width = `${progressPercentage}%`;

  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = '';

  currentQuestion.answers.forEach((answer) => {
    const answerButton = document.createElement('button');
    answerButton.classList.add('answer-btn');
    answerButton.textContent = answer.text;

    // what is dataset? a property of the DOM element that allows you to store custom data attributes
    answerButton.dataset.correct = answer.correct;

    answerButton.addEventListener('click', selectAnswer);

    answersContainer.appendChild(answerButton);
  });
}

function selectAnswer(event) {
  // optimization check
  if (answersDisabled) return;

  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === 'true';

  // Array.from is used to convert the HTMLCollection to an array so we can use forEach
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === 'true') {
      button.classList.add('correct');
    } else if (button === selectedButton) {
      button.classList.add('incorrect');
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;

    // check if there are more questions or if the quiz is over
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      // Quiz is over, fill the progress bar to 100% before showing results
      progressBarIndicator.style.width = '100%'; // Set the progress bar to 100%
      setTimeout(() => {
        showResult();
      }, 500); // Delay to allow the progress bar to fill before showing results
    }
  }, 1000); // Delay before moving to the next question or result screen
}

function showResult() {
  quizScreen.classList.remove('active');
  resultScreen.classList.add('active');

  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = 'Perfect Score! You are a Genius! 🎉';
    confetti({
      // Trigger confetti for perfect score!
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  } else if (percentage >= 80) {
    resultMessage.textContent = 'Great Job! You did well! 👍';
    confetti({
      // Trigger confetti for great job!
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  } else if (percentage >= 60) {
    resultMessage.textContent = 'Good Effort! Keep Practicing! 😊';
  } else if (percentage >= 40) {
    resultMessage.textContent = 'You can do better! Try again! 😕';
  } else {
    resultMessage.textContent = "Keep studying! You'll get better! 💪";
  }
}

function restartQuiz() {
  resultScreen.classList.remove('active');
  startQuiz();
}
