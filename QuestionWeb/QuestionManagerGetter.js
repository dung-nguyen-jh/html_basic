import QuestionsManager from "./QuestionsManager.js";
import ConstructedAnswerQuestion from "./Entities/ConstrcutedAnswerQuestion.js";
import MultipleChoiceQuestion from "./Entities/MultipleChoicesQuestion.js";

const QUESTION_MANAGER_KEY = 'questionManager';

const createQuestionManager = () => {
    const questionsManager = new QuestionsManager(15, "This is a test exam", []);
    const q1 = new ConstructedAnswerQuestion("What is the capital of France?", 5, "Paris");
    const q2 = new MultipleChoiceQuestion("What is 2 + 2?", 5, ["3", "4", "5", "6"], 1);
    const q3 = new MultipleChoiceQuestion("What is 2 + 3?", 5, ["3", "4", "5", "6"], 2);
    questionsManager.addQuestion(q1);
    questionsManager.addQuestion(q2);
    questionsManager.addQuestion(q3);
    return questionsManager;
}

const questionManagerGetter = () =>{
    const questionManager = localStorage.getItem(QUESTION_MANAGER_KEY);
    if (!questionManager){
        const newQuestionManager = createQuestionManager();
        localStorage.setItem(QUESTION_MANAGER_KEY, JSON.stringify(newQuestionManager));
        return newQuestionManager;
    }
    else{
        const oldMangerData = JSON.parse(questionManager);
        console.log("old data:");
        console.log(oldMangerData);
        const answers = oldMangerData.answers;
        const state = oldMangerData.state;
        const questionsManager = createQuestionManager();
        questionsManager.answers = answers;
        questionsManager.state = state;
        return questionsManager;
    }
}

export {QUESTION_MANAGER_KEY}

export default questionManagerGetter;