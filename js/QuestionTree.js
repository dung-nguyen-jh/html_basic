const Question = function (id, text, answerIdList, defaultNextQuestionId = null) {
  this.id = id;
  this.text = text;
  this.answerIdList = answerIdList;
  this.defaultNextQuestionId = defaultNextQuestionId;
};

const Answer = function (id,text, nextQuestionId) {
  this.id = id;
  this.text = text;
  this.nextQuestionId = nextQuestionId;
};

const questions = [
  new Question("q1", "Do you like pizza?", ["a1", "a2"]),
  new Question("q2", "Great! Thin crust or deep dish?", ["a3", "a4"], "q6"),
  new Question("q3", "What is your name?", []),
  new Question("q6", "What is your wrong with you?", []),
  new Question("q7", "cheese or tomatoes?", ['a5', 'a6']),
];

const answers = [
  new Answer("a1", "Yes", "q2"),
  new Answer("a2", "No", null),
  new Answer("a3", "Thin crust", "q7"),
  new Answer("a4", "Deep dish", "q3"),
  new Answer("a5", "cheese"),
  new Answer("a6", "tomatoes"),
];


function askQuestion(question) {
  const userAnswer = prompt(question.text);
  for (let answer of answers) {
    if (userAnswer.toLowerCase() === answer.text.toLowerCase()) {
      return answer;
    }
  }
  return null;
}

function runQuestionTree(currentQuestionId) {
  const currentQuestion = questions.find(question => question.id === currentQuestionId);

  if (!currentQuestion) {
    console.log("End of the decision tree.");
    return;
  }

  const answer = askQuestion(currentQuestion);
  if (answer === null) {
    const defaultNextQuestionId = currentQuestion.defaultNextQuestionId;
    if (defaultNextQuestionId !== null) {
      runQuestionTree(defaultNextQuestionId);
    } 
    else if (defaultNextQuestionId == null && currentQuestion.answerIdList.length === 0) {
      console.log("End of the decision tree.");
    }
    else {
      console.log("Invalid answer. Please try again.");
    }
    return;
  }

  runQuestionTree(answer.nextQuestionId);
}

function DeleteQuestion(questionId) {
  const index = questions.findIndex(question => question.id === questionId);
  if (index !== -1) {
    questions.splice(index, 1);
    for (let answer of answers) {
      if(answer.nextQuestionId === questionId) {
        answer.nextQuestionId = null;
      }
    }
  }
}

function DeleteAnswer(answerId) {
  const index = answers.findIndex(answer => answer.id === answerId);
  if (index !== -1) {
    answers.splice(index, 1);
    for (let question of questions) {
      question.answerIdList = question.answerIdList.filter(answer => answer !== answerId);
    }
  }
}

function updateQuestion(questionId, newQuestion) {
  const index = questions.findIndex(question => question.id === questionId);
  if (index !== -1) {
    newQuestion.id = questionId;
    questions[index] = newQuestion;
    console.log("Question updated successfully.");
  } else {
    console.log("Question not found.");
  }
}

function updateAnswer(answerId, newAnswer) {
  const index = answers.findIndex(answer => answer.id === answerId);
  if (index !== -1) {
    newAnswer.id = answerId;
    answers[index] = newAnswer;
    console.log("Answer updated successfully.");
  } else {
    console.log("Answer not found.");
  }
}

// DeleteQuestion(question1, "Great! Thin crust or deep dish?");
// DeleteAnswer("a4");
// DeleteAnswer("a6");

runQuestionTree("q1");
