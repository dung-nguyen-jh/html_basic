import Question from "./Entities/Question.js";
import { QUESTION_MANAGER_KEY } from "./QuestionManagerGetter.js";

const ExamState = {
    NOT_STARTED: "NOT_STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    FINISHED: "FINISHED"
};

class QuestionsManager {
    constructor(time, notes, questions = []) {
        this.answers = {};
        this.totalPoints = 0;
        this.time = time;
        this.notes = notes; 
        this.onExamStateChange = new EventTarget();
        this.state = ExamState.NOT_STARTED;
        this.timeInterval = null;
        this.questions = {};
        questions.forEach(question => this.addQuestion(question));
    }

    generateQuestionId () {
        return 'q' + Object.keys(this.questions).length;
    } 
    
    addQuestion(question) {
        if(question instanceof Question) {
            const newQuestionId = this.generateQuestionId();
            this.questions[newQuestionId] = question;
        }
    }
    
    getQuestionIds() {
        return Object.keys(this.questions);
    }
    
    getQuestion(questionId) {
        return this.questions[questionId];
    }

    provideAnswer(questionId, answer) {
        if(this.state === ExamState.IN_PROGRESS && this.questions[questionId]){
            this.answers[questionId] = answer;
        }      
    }
    
    calculateAnswersTotalPoints() {
        for(const questionId in this.questions) {
            const question = this.questions[questionId];
            const answer = this.answers[questionId];
            this.totalPoints += question.validateAnswer(answer);
            console.log(question)
            console.log(this.totalPoints)
        }
    }

    getExamDetails() {
        return {
            time: this.time,
            notes: this.notes,
            questionsCount: Object.keys(this.questions).length,
        };
    }

    start() {
        this.state = ExamState.IN_PROGRESS;
        this.alertStateChange()
        let countdown = this.time;
        this.alertCurrentTime(countdown);
        this.timeInterval = setInterval(()=>{
            countdown--;
            this.alertCurrentTime(countdown);
            if (countdown <= 0) {
                this.finish();
            }
        }, 1000);
    }    

    restart() {
        this.answers = {};
        this.totalPoints = 0;
        this.state = ExamState.NOT_STARTED;
        localStorage.setItem(QUESTION_MANAGER_KEY, JSON.stringify(this));
    }

    finish() {
        clearInterval(this.timeInterval);
        this.state = ExamState.FINISHED;
        this.calculateAnswersTotalPoints();
        this.alertStateChange();
        console.log(this.answers)
        localStorage.setItem(QUESTION_MANAGER_KEY, JSON.stringify(this));
    }

    alertStateChange(){
        this.onExamStateChange.dispatchEvent(new CustomEvent('stateChange', {detail: this.state}));
    }

    alertCurrentTime(timeLeft){
        this.onExamStateChange.dispatchEvent(new CustomEvent('timeChange', {detail: timeLeft}));
    }
}

export {ExamState, QuestionsManager}

export default QuestionsManager;