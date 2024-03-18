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
  const answerList = [];
  for (let answerId of question.answerIdList) {
    answerList.push(answers[answerId]);
  }
  
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
    const defaultNextQuestion = currentQuestion.defaultNextQuestion;
    if (defaultNextQuestion !== null) {
      runQuestionTree(defaultNextQuestion);
    } 
    else if (defaultNextQuestion == null && currentQuestion.answerList.length === 0) {
      console.log("End of the decision tree.");
    }
    else {
      console.log("Invalid answer. Please try again.");
    }
    return;
  }

  runQuestionTree(answer.nextQuestion);
}

function AddQuestion(text, answerIdList=[], defaultNextQuestion = null) {
  //create new id
        const newQuestionId = "q" + (Object.keys(questions).length + 1);
        //add new question to the questions object
        questions[newQuestionId] = new Question(text, answerIdList, defaultNextQuestion);
        if(answerIdList.lenght!==0){
        //add question to the answers object
          for(let answerId of answerIdList){
            //loop through the answerIdList and add the new question to the questionsIdList
            if(answers[answerId]){
              //if the answerId exists in the answers object, add the new question to the questionsIdList
              if(answers[answerId].questionsIdList.indexOf(newQuestionId) === -1)
                answers[answerId].questionsIdList.push(newQuestionId);
          }
        }
      }
      if(defaultNextQuestion){
        if(questions[defaultNextQuestion]){
          questions[defaultNextQuestion].pointedToBy.push(newQuestionId);
        }
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
    if(questions[questionId]){
      //if the questionId exists in the questions object, add the new answer to the answerIdList
      if(questions[questionId].answerIdList.indexOf(newAnswerId) === -1)
        questions[questionId].answerIdList.push(newAnswerId);
    }
  }
  if(nextQuestion){
    if(questions[nextQuestion]){
      questions[nextQuestion].pointedToBy.push(newAnswerId);
    }
  }
}

function DeleteQuestion(questionId) {
  if(questions[questionId]){
    const currentQuestion = questions[questionId];
    const answerIdList = currentQuestion.answerIdList;
    //loop through the answers object and delete the question from the questionsIdList
    for(let answerId in answerIdList){
      if(answers[answerId] && answers[answerId].questionsIdList.indexOf(questionId) !== -1){
        answers[answerId].questionsIdList.splice(answers[answerId].questionsIdList.indexOf(questionId), 1);
        if(answers[answerId].questionsIdList.length === 0)
          DeleteAnswer(answerId);
      }   
    }
    const pointedToBy = currentQuestion.pointedToBy;
    //loop through the answers object and delete the question from the nextQuestion
    for(let answerId of pointedToBy){
      // console.log('answerId: '+answerId);
      if(answers[answerId] && answers[answerId].nextQuestion == questionId){
        // console.log('found '+answers[answerId].nextQuestion);
        answers[answerId].nextQuestion = null;
      }
    }
    //loop through the questions object and delete the question from the defaultNextQuestion
    for(let questionId of pointedToBy){
      if(questions[questionId] && questions[questionId].defaultNextQuestion === questionId){
        questions[questionId].defaultNextQuestion = null;
      }
    }

    //remove the pointed by by this question
    if (currentQuestion.defaultNextQuestionId !== null) {
      if (questions[currentQuestion.defaultNextQuestionId]) {
        questions[currentQuestion.defaultNextQuestionId].pointedToBy.splice(questions[currentQuestion.defaultNextQuestionId].pointedToBy.indexOf(questionId), 1);
      }
    }
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
      if(questions[questionId] && questions[questionId].answerIdList.indexOf(answerId) !== -1){
        questions[questionId].answerIdList.splice(questions[questionId].answerIdList.indexOf(answerId), 1);
      } 
    }
    //remove the pointed by by this answer
    if(currentAnswer.nextQuestion){
      if(questions[currentAnswer.nextQuestion]){
        questions[currentAnswer.nextQuestion].pointedToBy.splice(questions[currentAnswer.nextQuestion].pointedToBy.indexOf(answerId), 1);
      }
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
    if(answerIdList && questiond[questionId].answerIdList !== answerIdList){
      //update the answerIdList
      for(let answerId of questiond[questionId].answerIdList){
        //loop through the answerIdList and add the new question to the questionsIdList
        if(!answerIdList.includes(answerId)){
          //if the answerId exists in the answers object, delete the question from the questionsIdList
          if(answer[answerId] && answers[answerId].questionsIdList.indexOf(questionId) !== -1){
            answers[answerId].questionsIdList.splice(answers[answerId].questionsIdList.indexOf(questionId), 1);
          }
          if(answer[answerId].questionsIdList.length === 0)
            DeleteAnswer(answerId);
        }
      }
      questions[questionId].answerIdList = answerIdList;
    }
    if(defaultNextQuestion && questiond[questionId].defaultNextQuestion !== defaultNextQuestion){
      if(questions[defaultNextQuestion]){
        const currentQuestion = questions[questionId];
        const nextQuestionId = currentQuestion.defaultNextQuestion;
        if(questions[nextQuestionId].pointedToBy.indexOf(questionId) !== -1){
          questions[nextQuestionId].pointedToBy.splice(questions[nextQuestionId].pointedToBy.indexOf(questionId), 1);
        }
        questions[questionId].defaultNextQuestion = defaultNextQuestion;
      }
    }
    console.log("update question successfully");
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
      for(let questionId of answers[answerId].questionsIdList){
        //loop through the questionsIdList and add the new answer to the answerIdList
        if(!questionsIdList.includes(questionId)){
          //if the questionId exists in the questions object, delete the answer from the answerIdList
          if(questions[questionId] && questions[questionId].answerIdList.indexOf(answerId) !== -1){
            questions[questionId].answerIdList.splice(questions[questionId].answerIdList.indexOf(answerId), 1);
          }
        }
      }
      answers[answerId].questionsIdList = questionsIdList;
    }
    if(nextQuestion && answer[answerId].nextQuestion !== nextQuestion){
      answers[answerId].nextQuestion = nextQuestion;
      const currentNextQuestion = answers[answerId].nextQuestion;
      if(questions[currentNextQuestion].pointedToBy.indexOf(answerId) !== -1){
        questions[currentNextQuestion].pointedToBy.splice(questions[currentNextQuestion].pointedToBy.indexOf(answerId), 1);
      }
      if(questions[nextQuestion]){
        questions[nextQuestion].pointedToBy.push(answerId);
      }
    }
    console.log("update answer successfully");
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
