import Question from "./Question.js";

class ConstructedAnswerQuestion extends Question {
    constructor(questionText,points, correctAnswer) {
      super(questionText,points);
      this.correctAnswer = correctAnswer;
    }

    getQuestionText() {
      return this.questionText;
    }
  
    validateAnswer(answer) {
    //need to implement some sort of regex to check for the answer
      return answer?.trim().toLowerCase() === this.correctAnswer.trim().toLowerCase()
        ? this.points
        : 0;
    }
    static fromJSON(json) {
      const { questionText, points, correctAnswer } = json;
      return new ConstructedAnswerQuestion(questionText, points, correctAnswer);
    }
  }

    export default ConstructedAnswerQuestion;