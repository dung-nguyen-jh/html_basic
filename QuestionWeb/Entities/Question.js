class Question {
    #points;
    #questionText;
    constructor(questionText, points) {
      this.#questionText = questionText;
      this.#points = points;
    }

    getQuestionText() {
        return this.#questionText;
    }
  
    validateAnswer(answer) {
      // To be implemented in subclasses
      //return the points of the answer
      return 0;
    }

    getQuestionStatus(answer) {
        const points = this.validateAnswer(answer);
        if(answer === "") {
            return QuestionStatus.NOT_ANSWERED;
        }
        if(points === this.points) {
            return QuestionStatus.CORRECT;
        } else if(points > 0) {
            return QuestionStatus.PARTLY_CORRECT;
        } else {
            return QuestionStatus.INCORRECT;
        }
    }

    get points() {
        return this.#points;
    }

    get questionText() {
        return this.#questionText;
    }
  }

const QuestionStatus = {
    NOT_ANSWERED: "NOT_ANSWERED",
    CORRECT: "CORRECT",
    INCORRECT: "INCORRECT",
    PARTLY_CORRECT: "PARTLY_CORRECT"
};

export {Question, QuestionStatus};

export default Question;
    
  