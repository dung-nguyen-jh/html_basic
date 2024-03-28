import questionsManagerGetter from "../QuestionManagerGetter.js";

const questionsManager = questionsManagerGetter();
const scoreElement = document.getElementById("score");

questionsManager.calculateAnswersTotalPoints();
scoreElement.textContent = `${questionsManager.totalPoints}`;
const restartButton = document.getElementById("restart-btn");
restartButton.addEventListener("click", restartExam);

function restartExam() {
    location.href = "QuestionWebHome.html";
    questionsManager.restart();
}