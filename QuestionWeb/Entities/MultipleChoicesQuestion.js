import Question from "./Question.js";

class MultipleChoiceQuestion extends Question {
    constructor(questionText, points, options, correctOptionIndex) {
      super(questionText, points);
      this.options = options;
      this.correctOptionIndex = correctOptionIndex;
      if(correctOptionIndex >= options.length) {
        throw new Error("correctOptionIndex must be less than the number of options");
      }
    }
  
    getQuestionText() {
      return this.questionText;
    }

    getOptions() {
      return this.options;
    }
  
    validateAnswer(answer) {
      return answer && answer == this.correctOptionIndex
        ? this.points
        : 0;
    }
    static fromJSON(json) {
      const { questionText, points, options, correctOptionIndex } = json;
      return new MultipleChoiceQuestion(questionText, points, options, correctOptionIndex);
    }
  }

  export default MultipleChoiceQuestion;