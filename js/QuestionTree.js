const Question = function (text, answerIdList=[], defaultNextQuestionId = null) {
  this.text = text;
  this.answerIdList = answerIdList;
  this.pointedToBy = [];
  this.defaultNextQuestionId = defaultNextQuestionId;
};

const Answer = function (text, questionsIdList = [], nextQuestion = null) {
  this.questionsIdList = questionsIdList; 
  this.text = text;
  this.nextQuestion = nextQuestion;
};

const questions = {}

const answers = {}


function askQuestion(question) {
  //for the sake of user interface, have to get the list
  //of multiple answers and let the user choose one
  const answerList = [];
  for (let answerId of question.answerIdList) {
    answerList.push(answers[answerId]);
  }

  //getting the user's answer using the prompt
  //use the trim version of the answer to compare with the answer text
  const userAnswer = prompt(question.text+"\n"+answerList.map((answer, index) => `${answer.text}`).join("\n"));
  for (let answerId of question.answerIdList) {
    if (userAnswer.toLowerCase() === answers[answerId].text.toLowerCase()) {
      return answers[answerId];
    }
  }
  return null;
}

function runQuestionTree(currentQuestionId) {
  const currentQuestion = questions[currentQuestionId];

  if (!currentQuestion) {
    console.log("End of the decision tree.");
    return;
  }

  const answer = askQuestion(currentQuestion);
  if (answer === null) {
    //if the user's answer is not valid
    //check if this question has a default next question
    //if it does, run the default next question
    const defaultNextQuestion = currentQuestion.defaultNextQuestion;
    if (defaultNextQuestion !== null) {
      runQuestionTree(defaultNextQuestion);
    } 
    //else check if the current question just simply ends the decision tree
    //the end of the tree is the leaf node
    //which means that it has no answer and no default next question
    else if (defaultNextQuestion == null && currentQuestion.answerIdList.length === 0) {
      console.log("End of the decision tree.");
    }
    //or else it is an invalid answer
    else {
      console.log("Invalid answer. Please try again.");
    }
    return;
  }

  runQuestionTree(answer.nextQuestion);
}

//add a question id to the answer's questionsIdList
function addToAnswerQuestionIdList(answerId, questionId){
  if(answers[answerId] && answers[answerId].questionsIdList.indexOf(questionId) === -1){
    answers[answerId].questionsIdList.push(questionId);
  }
}

// add an answer id to the question's answerIdList
function addToQuestionAnswerIdList(questionId, answerId){
  if(questions[questionId] && questions[questionId].answerIdList.indexOf(answerId) === -1){
    questions[questionId].answerIdList.push(answerId);
  }
}

//alter the list of elements which are currently potiting to the question
function addToQuestionPointedToBy(questionId, elementId){
  if(questions[questionId] && questions[questionId].pointedToBy.indexOf(elementId) === -1){
    questions[questionId].pointedToBy.push(elementId);
  }
}

//remove a question id from the answer's questionsIdList
function removeFromAnswerQuestionIdList(answerId, questionId){
  if(answers[answerId] && answers[answerId].questionsIdList.indexOf(questionId) !== -1){
    answers[answerId].questionsIdList.splice(answers[answerId].questionsIdList.indexOf(questionId), 1);
    if(answers[answerId].questionsIdList.length === 0)
      DeleteAnswer(answerId);
  }
}

//remove an answer id from the question's answerIdList
function removeFromQuestionAnswerIdList(questionId, answerId){
  if(questions[questionId] && questions[questionId].answerIdList.indexOf(answerId) !== -1){
    questions[questionId].answerIdList.splice(questions[questionId].answerIdList.indexOf(answerId), 1);
  }
}

//remove an element id from the question's pointedToBy list
function removeFromQuestionPointedToBy(questionId, elementId){
  if(questions[questionId] && questions[questionId].pointedToBy.indexOf(elementId) !== -1){
    questions[questionId].pointedToBy.splice(questions[questionId].pointedToBy.indexOf(elementId), 1);
  }
}

function updateQuestionAnswerIdList(questionId, answerIdList){
  if(questions[questionId]){
    if(questions[questionId].answerIdList !== answerIdList){
      //because each answer has its own list of questions it is related to
      //update the answerIdList accordingly to the new question answer list
      for(let answerId of questions[questionId].answerIdList){
        if(!answerIdList.includes(answerId)){
          removeFromAnswerQuestionIdList(answerId, questionId);
        }
        addToAnswerQuestionIdList(answerId, questionId);
      }
      questions[questionId].answerIdList = answerIdList;
    }
  }
  else{
    console.log("question does not exist to update the answerIdList");
  }
}

function updateAnswerQuestionIdList(answerId, questionIdList){
  if(answers[answerId]){
    if(answers[answerId].questionsIdList !== questionIdList){
      //because each question has its own list of answers it is related to
      //update the questionIdList accordingly to the new answer question list
      for(let questionId of answers[answerId].questionsIdList){
        if(!questionIdList.includes(questionId)){
          removeFromQuestionAnswerIdList(questionId, answerId);
        }
        addToQuestionAnswerIdList(questionId, answerId);
      }
      answers[answerId].questionsIdList = questionIdList;
    }
  }
  else{
    console.log("answer does not exist to update the questionIdList");
  }
}

//remove the id of the next question from the answer that are pointing to this question
function unlinkAnswersToQuestion(questionId){
  //remove the current question from the answer that are pointing to this
  const currentQuestion = questions[questionId];
  const answerIdPoitingList = currentQuestion.pointedToBy;
  const answerIdList = currentQuestion.answerIdList;
  for(let answerId of answerIdPoitingList){
    //remove the answer next questions that are pointing to this question
    if(answers[answerId] && answers[answerId].nextQuestion === questionId){
      answers[answerId].nextQuestion = null;
    }
  }
}

//remove questions that are pointing to this question
//also remove this question from the questions that are pointing to the next question
function unlinkQuestionToQuestion(questionId){
  const currentQuestion = questions[questionId];
  const pointedToBy = currentQuestion.pointedToBy;
  //becasue each question has a list of id pointing to it
  //remove this id from all the questions that are pointing to this question
  for(let questionId of pointedToBy){
    if(questions[questionId] && questions[questionId].defaultNextQuestion === questionId){
      questions[questionId].defaultNextQuestion = null;
    }
  }
  //update the pointed to of the question this question is pointing to
  if(currentQuestion.defaultNextQuestion){
    const nextQuestionId = currentQuestion.defaultNextQuestion;
    if(questions[nextQuestionId]){
      //check if the current question in the next question's pointedToBy list
      const indexOfQuestion = questions[nextQuestionId].pointedToBy.indexOf(questionId);
      if(indexOfQuestion !== -1)
        questions[nextQuestionId].pointedToBy.splice(indexOfQuestion, 1);
    }
  }
}

function AddQuestion(text, answerIdList=[], defaultNextQuestion = null) {
        //create new id
        const newQuestionId = "q" + (Object.keys(questions).length + 1);
        //add new question to the questions object
        questions[newQuestionId] = new Question(text, answerIdList, defaultNextQuestion);
        if(answerIdList.length!==0){
        //add question to the answers object
          for(let answerId of answerIdList){
            //because the answers hold a list of questions they are realted to
            //add new question to the answer's questionsIdList
            addToAnswerQuestionIdList(answerId, newQuestionId);
        }
      }
      if(defaultNextQuestion){
        //becasue each questions has a list of id pointing to it
        addToQuestionPointedToBy(defaultNextQuestion, newQuestionId);
      }
}

function AddAnswer(text, questionsIdList = [], nextQuestion = null) {
  //create new id
  const newAnswerId = "a" + (Object.keys(answers).length + 1);
  //add new answer to the answers object
  answers[newAnswerId] = new Answer(text, questionsIdList, nextQuestion);
  //add answer to the questions object
  for(let questionId of questionsIdList){
    //loop through the questionsIdList and add the new answer to the answerIdList
   addToQuestionAnswerIdList(questionId, newAnswerId);
  }
  if(nextQuestion){
    addToQuestionPointedToBy(nextQuestion, newAnswerId);
  }
}

function DeleteQuestion(questionId) {
  if(questions[questionId]){
    const currentQuestion = questions[questionId];
    const answerIdList = currentQuestion.answerIdList;
    //loop through the answers object and delete the question from the questionsIdList
    for(let answerId of answerIdList){
      //because each question has a list of answers it is related to
      //if the questions are deleted, the answers should be updated
      //if the answer has no questions relate to it, delete the answer
      removeFromAnswerQuestionIdList(answerId, questionId);   
    }
    //all elements pointing to this question should be updated
    unlinkAnswersToQuestion(questionId);
    unlinkQuestionToQuestion(questionId);
    //if the questionId exists in the questions object, delete the question
    delete questions[questionId];
    console.log("delete question successfully")
  }
}

function DeleteAnswer(answerId) {
  if(answers[answerId]){
    const currentAnswer = answers[answerId];
    const questionIdList = currentAnswer.questionsIdList;
    //loop through the questions object and delete the answer from the answerIdList
    for(let questionId of questionIdList){
      removeFromQuestionAnswerIdList(questionId, answerId);
    }
    //remove the pointed question by by this answer
    if(currentAnswer.nextQuestion){
      removeFromQuestionPointedToBy(currentAnswer.nextQuestion, answerId);
    }

    //if the answerId exists in the answers object, delete the answer
    delete answers[answerId];
    console.log("delete answer successfully")
  }
}

function getQuestionsById(questionId){
  return questions[questionId];
}

function getAnswersById(answerId){
  return answers[answerId];
}

function getAnswerOfQuestion(questionId){
  return questions[questionId].answerIdList;
}

function getQuestionOfAnswer(answerId){
  return answers[answerId].questionsIdList;
}

function updateQuestion(questionId,{text, answerIdList, defaultNextQuestion}){
  if(questions[questionId]){
    if(questions[questionId].text !== text){
      //update the question text
      questions[questionId].text = text;
    }
    if(answerIdList){
      //if user pass in an answer list, update the answerIdList
      updateQuestionAnswerIdList(questionId, answerIdList);
    }
      
    if(defaultNextQuestion && questions[questionId].defaultNextQuestion !== defaultNextQuestion){
     //because each questions store the id of the elements poitning to it
     //first we need to update that list of the defaultNextQuestion of this one
     removeFromQuestionPointedToBy(questions[questionId].defaultNextQuestion, questionId);
     //then we add this question to the list of poitned to by of the defaultNextQuestion
     addToQuestionPointedToBy(defaultNextQuestion, questionId);
     questions[questionId].defaultNextQuestion = defaultNextQuestion;
    }
    console.log("update question successfully");
  }
  else{
    console.log("question does not exist");
  }
}

function updateAnswer(answerId,{text, questionsIdList, nextQuestion}){
  if(answers[answerId]){
    if(answers[answerId].text !== text){
      //update the answer text
      answers[answerId].text = text;
    }
    if(questionsIdList && answers[answerId].questionsIdList !== questionsIdList){
      //update the questionsIdList
      updateAnswerQuestionIdList(answerId, questionsIdList);
    }
    if(nextQuestion && answers[answerId].nextQuestion !== nextQuestion){
      //because each question has a list of id pointing to it
      //first we need to update that list of the nextQuestion of this one
      removeFromQuestionPointedToBy(answers[answerId].nextQuestion, answerId);
      //then we add this answer to the list of poitned to by of the nextQuestion
      addToQuestionPointedToBy(nextQuestion, answerId);
      answers[answerId].nextQuestion = nextQuestion;
    }
    console.log("update answer successfully");
  }
  else{
    console.log("answer does not exist");
  }
}



// DeleteQuestion(question1, "Great! Thin crust or deep dish?");
// DeleteAnswer("a4");
// DeleteAnswer("a6");

// Example usage for AddQuestion
AddQuestion("Do you like pizza?", []);
AddQuestion("Great! Thin crust or deep dish?", [], "q6");
AddQuestion("What is your name?", []);
AddQuestion("What is your wrong with you?", []);
AddQuestion("cheese or tomatoes?", []);

// Example usage for AddAnswer
AddAnswer("Yes", ["q1"], "q2");
AddAnswer("No", ["q1"], null);
AddAnswer("Thin crust", ["q2"], "q5");
AddAnswer("Deep dish", ["q2"], "q3");
AddAnswer("cheese", ["q5"],'q3');
AddAnswer("tomatoes", ["q5"],'q3');

runQuestionTree("q1");
