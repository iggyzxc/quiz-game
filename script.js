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
const timerContainer = document.querySelector('.timer-container'); // Change timerElement to target the OUTER div (.timer-container)
const timerDisplaySpan = document.getElementById('timer'); // Keep a reference to the span inside it for updating its text content

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
let answersDisabled = false; // Prevents multiple clicks on answers
let timePerQuestion = 10; // Default time in seconds for each question
let timeLeft = timePerQuestion; // Remaining time for the current question
let timerInterval; // stores the interval ID for clearing

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
  clearInterval(timerInterval); // Ensure any lingering timer is cleared on start

  startScreen.classList.remove('active');
  quizScreen.classList.add('active');

  showQuestion();
}

function handleAnswerFeedbackAndProceed(
  isCorrectlyAnswered,
  selectedButton = null,
) {
  if (answersDisabled) return; // Prevent multiple clicks while processing

  answersDisabled = true; // Disable answer buttons immediately after an answer is selected

  // Highlight correct/incorrect answers
  // If selectedButton is null (timer ran out), skip highlighting.
  if (selectedButton !== null) {
    Array.from(answersContainer.children).forEach((button) => {
      if (button.dataset.correct === 'true') {
        button.classList.add('correct');
      } else if (button === selectedButton && !isCorrectlyAnswered) {
        // Only add 'incorrect' class if the selected button was actually wrong
        button.classList.add('incorrect');
      }
    });
  }

  if (isCorrectlyAnswered) {
    score++;
    scoreSpan.textContent = score;
  }

  clearInterval(timerInterval); // Stop the timer when an answer is selected

  setTimeout(() => {
    timerContainer.classList.remove('warning'); // Ensure the warning class is removed when proceeding

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

function showQuestion() {
  // reset state
  answersDisabled = false; // Reenable answer buttons for the new question

  const currentQuestion = quizQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercentage =
    (currentQuestionIndex / quizQuestions.length) * 100;
  progressBarIndicator.style.width = `${progressPercentage}%`;

  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = '';

  // Timer setup for each question
  timeLeft = timePerQuestion; // Reset time for the new question

  // Update text content on the SPAN
  timerDisplaySpan.textContent = timeLeft;

  // Apply class removal to the CONTAINER
  timerContainer.classList.remove('warning');

  clearInterval(timerInterval); // Clear any existing timer to prevent multiple timers

  timerInterval = setInterval(() => {
    timeLeft--;

    // Update text content on the SPAN
    timerDisplaySpan.textContent = timeLeft;

    // change timer color
    if (timeLeft <= 5) {
      timerContainer.classList.add('warning'); // Add warning class if 5 seconds or less
    } else {
      timerContainer.classList.remove('warning'); // Ensure warning class is removed if time goes above 5 (e.g., on restart or if timePerQuestion was initially less than 5)
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval); // Stop the timer when it reaches zero
      // Time's up! Automatically proceed to the next question
      // We pass 'false' to indicate that the answer was not selected
      handleAnswerFeedbackAndProceed(false, null); // Pass false for correctness, null for selectedButton
    }
  }, 1000); // Update every second

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
  // This check is important to prevent re-processing clicks while feedback is shown
  if (answersDisabled) return;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === 'true';

  handleAnswerFeedbackAndProceed(isCorrect, selectedButton);
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
  clearInterval(timerInterval);
  // Apply class removal to the CONTAINER
  timerContainer.classList.remove('warning');
  startQuiz();
}
