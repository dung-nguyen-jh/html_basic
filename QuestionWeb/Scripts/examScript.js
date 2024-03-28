import MultipleChoiceQuestion from "../Entities/MultipleChoicesQuestion.js";
import ConstructedAnswerQuestion from "../Entities/ConstrcutedAnswerQuestion.js";
import QuestionsManager,{ ExamState } from "../QuestionsManager.js";
import questionManagerGetter from "../QuestionManagerGetter.js";
let currentQuestionIndex = 0;
const nextButton = document.getElementById("next-btn");
const answersElement = document.getElementById("answers");

const questionManager = questionManagerGetter();
console.log(questionManager.getQuestion('q1'));
const questionIds = questionManager.getQuestionIds();
shuffleArray(questionIds);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}


questionManager.onExamStateChange.addEventListener(
  "stateChange",
  handelStateChange
);
questionManager.onExamStateChange.addEventListener(
  "timeChange",
  handleTimeChange
);
nextButton.addEventListener("click", nextQuestion);

function handelStateChange(event) {
  if (event.detail === ExamState.FINISHED) {
    endExam();
  }
}

function handleTimeChange(event) {
  changeTimer(event.detail);
}

function displayQuestion() {
  const questionElement = document.getElementById("question");
  answersElement.innerHTML = "";
  console.log(answersElement);
  const currentQuestion = questionManager.getQuestion(
    questionIds[currentQuestionIndex]
  );

  questionElement.textContent = `${currentQuestionIndex+1}. ${currentQuestion.questionText}`;
  

  if (currentQuestion instanceof MultipleChoiceQuestion) {
    displayCurrentMultipleAnswerField(currentQuestion);
  } else if (currentQuestion instanceof ConstructedAnswerQuestion) {
    displayCurrentConstrcutedAnswerField();
  }
}

function displayCurrentMultipleAnswerField(currentQuestion) {
  const options = currentQuestion.getOptions();
  console.log("options:" + options);
  options.forEach((answer, index) => {
    const answerInput = document.createElement("input");
    answerInput.type = "radio";
    answerInput.name = "answer";
    answerInput.value = index;
    answerInput.className = "tick-input";
    answerInput.addEventListener("change", handleMultipleChoiceAnswerChange);

    const label = document.createElement("label");
    label.textContent = answer;

    const answerContainer = document.createElement("div");
    answerContainer.appendChild(answerInput);
    answerContainer.appendChild(label);
    answersElement.appendChild(answerContainer);
  });
}

function displayCurrentConstrcutedAnswerField() {
    answersElement.innerHTML = "";
    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.className = "answer-input";
    answerInput.placeholder = "Your answer...";
    answerInput.addEventListener("input", handleConstrcutedAnswerKeyup);
    answersElement.appendChild(answerInput);
}

function handleConstrcutedAnswerKeyup(event) {
    questionManager.provideAnswer(
        questionIds[currentQuestionIndex],
        event.target.value
    );
}

function handleMultipleChoiceAnswerChange(event) {
    questionManager.provideAnswer(
        questionIds[currentQuestionIndex],
        event.target.value
    );
}

function nextQuestion() {
  if (currentQuestionIndex < questionIds.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    questionManager.finish();
  }
}

function endExam() {
  window.location.href = "QuestionWebResult.html";
}

function changeTimer(value) {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `Time left: ${value} seconds`;
}

window.onload = function () {
  displayQuestion();
  // Start timer
  questionManager.start();
};

export { nextQuestion };
