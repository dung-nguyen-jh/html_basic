function QuestionTree(createQuestionIdFunc = null, createAnswerIdFunc = null) {
  const Question = function (
    text,
    answerIdList = [],
    defaultNextQuestionId = null
  ) {
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

  const questions = {};

  const answers = {};

  const createQuestionId = createQuestionIdFunc
    ? createQuestionIdFunc
    : function (questions) {
        return "q" + (Object.keys(questions).length + 1);
      }

  const createAnswerId = createAnswerIdFunc
    ? createAnswerIdFunc
    : function (answers) {
        return "a" + (Object.keys(answers).length + 1);
      }

  function askQuestion(question) {
    const answerList = [];
    for (const answerId of question.answerIdList) {
      answerList.push(answers[answerId]);
    }

    //promt the whole question and list of answers for the user to choose
    const userAnswer = prompt(
      question.text +
        "\n" +
        answerList.map((answer, index) => `${answer.text}`).join("\n")
    );
    for (const answerId of question.answerIdList) {
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
      //a question is the end of tree if it has no answer and no defaultNextQuestion
      //just like a leaf node in a tree
      else if (
        defaultNextQuestion == null &&
        currentQuestion.answerIdList.length === 0
      ) {
        console.log("End of the decision tree.");
      } else {
        console.log("Invalid answer. Please try again.");
      }
      return;
    }

    runQuestionTree(answer.nextQuestion);
  }

  function addToQuestionListOfAnswer(answerId, questionId) {
    if (
      answers[answerId] &&
      answers[answerId].questionsIdList.indexOf(questionId) === -1
    ) {
      answers[answerId].questionsIdList.push(questionId);
    }
  }

  function addToAnswerListOfQuestion(questionId, answerId) {
    if (
      questions[questionId] &&
      questions[questionId].answerIdList.indexOf(answerId) === -1
    ) {
      questions[questionId].answerIdList.push(answerId);
    }
  }

  function addToListElementPointToQuestion(questionId, elementId) {
    if (
      questions[questionId] &&
      questions[questionId].pointedToBy.indexOf(elementId) === -1
    ) {
      questions[questionId].pointedToBy.push(elementId);
    }
  }

  function removeFromQuestionIdListOfAnswer(answerId, questionId) {
    if (
      answers[answerId] &&
      answers[answerId].questionsIdList.indexOf(questionId) !== -1
    ) {
      answers[answerId].questionsIdList.splice(
        answers[answerId].questionsIdList.indexOf(questionId),
        1
      );
      if (answers[answerId].questionsIdList.length === 0)
        deleteAnswer(answerId);
    }
  }

  function removeFromAnswerListOfQuestion(questionId, answerId) {
    if (
      questions[questionId] &&
      questions[questionId].answerIdList.indexOf(answerId) !== -1
    ) {
      questions[questionId].answerIdList.splice(
        questions[questionId].answerIdList.indexOf(answerId),
        1
      );
    }
  }

  function removeFromListElementPointToQuestion(questionId, elementId) {
    if (
      questions[questionId] &&
      questions[questionId].pointedToBy.indexOf(elementId) !== -1
    ) {
      questions[questionId].pointedToBy.splice(
        questions[questionId].pointedToBy.indexOf(elementId),
        1
      );
    }
  }

  function updateAnswerIdListOfQuestion(questionId, answerIdList) {
    if (questions[questionId]) {
      if (questions[questionId].answerIdList !== answerIdList) {
        for (const answerId of questions[questionId].answerIdList) {
          if (!answerIdList.includes(answerId)) {
            removeFromQuestionIdListOfAnswer(answerId, questionId);
          }
          addToQuestionListOfAnswer(answerId, questionId);
        }
        questions[questionId].answerIdList = answerIdList;
      }
    } else {
      console.log("question does not exist to update the answerIdList");
    }
  }

  function updateQuestionIdListOfAnswer(answerId, questionIdList) {
    if (answers[answerId]) {
      if (answers[answerId].questionsIdList !== questionIdList) {
        for (const questionId of answers[answerId].questionsIdList) {
          if (!questionIdList.includes(questionId)) {
            removeFromAnswerListOfQuestion(questionId, answerId);
          }
          addToAnswerListOfQuestion(questionId, answerId);
        }
        answers[answerId].questionsIdList = questionIdList;
      }
    } else {
      console.log("answer does not exist to update the questionIdList");
    }
  }

  function removeQuestionFromAnsersNextQuestion(questionId) {
    const currentQuestion = questions[questionId];
    const answerIdPointingList = currentQuestion.pointedToBy;
    for (const answerId of answerIdPointingList) {
      if (answers[answerId] && answers[answerId].nextQuestion === questionId) {
        answers[answerId].nextQuestion = null;
      }
    }
  }

  function removeQuestionFromQuestionsDefaultNextQuestion(questionId) {
    const currentQuestion = questions[questionId];
    const pointedToBy = currentQuestion.pointedToBy;
    for (const questionId of pointedToBy) {
      if (
        questions[questionId] &&
        questions[questionId].defaultNextQuestion === questionId
      ) {
        questions[questionId].defaultNextQuestion = null;
      }
    }
  }

  function removeQuestionFromOthersPointedToList(questionId) {
    const currentQuestion = questions[questionId];
    const defaultNextQuestion = currentQuestion.defaultNextQuestion;
    if (defaultNextQuestion && questions[defaultNextQuestion]) {
      const nextPointedToBy = questions[defaultNextQuestion].pointedToBy;
      if (nextPointedToBy.indexOf(questionId) !== -1) {
        questions[defaultNextQuestion].splice(
          nextPointedToBy.indexOf(questionId),
          1
        );
      }
    }
  }

  function addQuestion(text, answerIdList = [], defaultNextQuestion = null) {
    const newQuestionId = createQuestionId(questions);
    questions[newQuestionId] = new Question(
      text,
      answerIdList,
      defaultNextQuestion
    );
    if (answerIdList.length !== 0) {
      for (const answerId of answerIdList) {
        addToQuestionListOfAnswer(answerId, newQuestionId);
      }
    }
    if (defaultNextQuestion) {
      addToListElementPointToQuestion(defaultNextQuestion, newQuestionId);
    }
    return newQuestionId;
  }

  function addAnswer(text, questionsIdList = [], nextQuestion = null) {
    const newAnswerId = createAnswerId(answers);
    answers[newAnswerId] = new Answer(text, questionsIdList, nextQuestion);
    for (const questionId of questionsIdList) {
      addToAnswerListOfQuestion(questionId, newAnswerId);
    }
    if (nextQuestion) {
      addToListElementPointToQuestion(nextQuestion, newAnswerId);
    }
    return newAnswerId;
  }

  function deleteQuestion(questionId) {
    if (questions[questionId]) {
      const currentQuestion = questions[questionId];
      const answerIdList = currentQuestion.answerIdList;
      for (const answerId of answerIdList) {
        removeFromQuestionIdListOfAnswer(answerId, questionId);
      }
      removeQuestionFromAnsersNextQuestion(questionId);
      removeQuestionFromQuestionsDefaultNextQuestion(questionId);
      removeQuestionFromOthersPointedToList(questionId);
      delete questions[questionId];
      console.log("delete question successfully");
    }
  }

  function deleteAnswer(answerId) {
    if (answers[answerId]) {
      const currentAnswer = answers[answerId];
      const questionIdList = currentAnswer.questionsIdList;
      for (const questionId of questionIdList) {
        removeFromAnswerListOfQuestion(questionId, answerId);
      }
      if (currentAnswer.nextQuestion) {
        removeFromListElementPointToQuestion(
          currentAnswer.nextQuestion,
          answerId
        );
      }

      delete answers[answerId];
      console.log("delete answer successfully");
    }
  }

  function getQuestionsById(questionId) {
    return questions[questionId];
  }

  function getAnswersById(answerId) {
    return answers[answerId];
  }

  function getAnswerOfQuestion(questionId) {
    return questions[questionId].answerIdList;
  }

  function getQuestionOfAnswer(answerId) {
    return answers[answerId].questionsIdList;
  }

  function updateQuestion(
    questionId,
    { text, answerIdList, defaultNextQuestion }
  ) {
    if (questions[questionId]) {
      if (text && questions[questionId].text !== text) {
        questions[questionId].text = text;
      }
      if (answerIdList) {
        updateAnswerIdListOfQuestion(questionId, answerIdList);
      }

      if (
        defaultNextQuestion &&
        questions[questionId].defaultNextQuestion !== defaultNextQuestion
      ) {
        removeFromListElementPointToQuestion(
          questions[questionId].defaultNextQuestion,
          questionId
        );
        addToListElementPointToQuestion(defaultNextQuestion, questionId);
        questions[questionId].defaultNextQuestion = defaultNextQuestion;
      }
      console.log("update question successfully");
    } else {
      console.log("question does not exist");
    }
  }

  function updateAnswer(answerId, { text, questionsIdList, nextQuestion }) {
    if (answers[answerId]) {
      if (text && answers[answerId].text !== text) {
        answers[answerId].text = text;
      }
      if (
        questionsIdList &&
        answers[answerId].questionsIdList !== questionsIdList
      ) {
        updateQuestionIdListOfAnswer(answerId, questionsIdList);
      }
      if (nextQuestion && answers[answerId].nextQuestion !== nextQuestion) {
        removeFromListElementPointToQuestion(
          answers[answerId].nextQuestion,
          answerId
        );
        addToListElementPointToQuestion(nextQuestion, answerId);
        answers[answerId].nextQuestion = nextQuestion;
      }
      console.log("update answer successfully");
    } else {
      console.log("answer does not exist");
    }
  }
  function getQuestionIdList() {
    return Object.keys(questions);
  }

  function getAnswerIdList() {
    return Object.keys(answers);
  }

  function isAnswerNextQuestionConfigValid(
    questionLength,
    answerLength,
    answerNextQuestionConfigs
  ) {
    for (const answerNumber in answerNextQuestionConfigs) {
      if (
        answerNumber >= answerLength ||
        answerNextQuestionConfigs[answerNumber] >= questionLength
      ) {
        return false;
      }
    }
    return true;
  }

  function isDefaultNextQuestionConfigValid(
    questionLength,
    defaultNextQuestionConfigs
  ) {
    for (const questionNumber in defaultNextQuestionConfigs) {
      if (
        questionNumber >= questionLength ||
        defaultNextQuestionConfigs[questionNumber] >= questionLength
      ) {
        return false;
      }
    }
    return true;
  }

  function isQuestionsAnswerConfigValid(
    questionLength,
    answerLength,
    questionsAnswerConfigs
  ) {
    for (const questionNumber in questionsAnswerConfigs) {
      for (const answerNumber of questionsAnswerConfigs[questionNumber]) {
        if (questionNumber >= questionLength || answerNumber >= answerLength) {
          return false;
        }
      }
    }
    return true;
  }

  function addQuestionsAndAnswers(
    questions,
    answers,
    answerNextQuestionConfigs,
    defaultNextQuestionConfigs,
    questionsAnswerConfigs
  ) {
    const isValid =
      isAnswerNextQuestionConfigValid(
        questions.length,
        answers.length,
        answerNextQuestionConfigs
      ) &&
      isDefaultNextQuestionConfigValid(
        questions.length,
        defaultNextQuestionConfigs
      ) &&
      isQuestionsAnswerConfigValid(
        questions.length,
        answers.length,
        questionsAnswerConfigs
      );

    if (!isValid) {
      console.log("Invalid configuration");
      return;
    }
    const listAddedQuestions = [];
    const listAddedAnswers = [];

    for (const questionText of questions) {
      const newQuestionId = addQuestion(questionText);
      listAddedQuestions.push(newQuestionId);
    }

    for (const answerText of answers) {
      const newAnswerId = addAnswer(answerText);
      listAddedAnswers.push(newAnswerId);
    }

    // Update default next question for questions
    for (const questionNumber in defaultNextQuestionConfigs) {
      try {
        const questionId = listAddedQuestions[questionNumber];
        const defaultNextQuestionSeq =
          defaultNextQuestionConfigs[questionNumber];
        const defaultNextQuestion = listAddedQuestions[defaultNextQuestionSeq];
        updateQuestion(questionId, {
          defaultNextQuestion: defaultNextQuestion,
        });
      } catch (err) {
        console.log(err);
      }
    }

    // Update next question for answers
    for (const answerNumber in answerNextQuestionConfigs) {
      try {
        const answerId = listAddedAnswers[answerNumber];
        const nextQuestionSeq = answerNextQuestionConfigs[answerNumber];
        nextQuestion = listAddedQuestions[nextQuestionSeq];
        updateAnswer(answerId, { nextQuestion: nextQuestion });
      } catch (err) {
        console.log(err);
      }
    }

    // Update answer list for questions
    for (const questionNumber in questionsAnswerConfigs) {
      try {
        const questionId = listAddedQuestions[questionNumber];
        const answerIdListSeq = questionsAnswerConfigs[questionNumber];
        const answerIdList = answerIdListSeq.map(
          (seq) => listAddedAnswers[seq]
        );
        updateQuestion(questionId, { answerIdList: answerIdList });
      } catch (err) {
        console.log(err);
      }
    }
  }



  return {
    addAnswer,
    addQuestion,
    deleteAnswer,
    deleteQuestion,
    runQuestionTree,
    getQuestionsById,
    getAnswersById,
    getAnswerOfQuestion,
    getQuestionOfAnswer,
    updateQuestion,
    updateAnswer,
    addQuestionsAndAnswers,
    getAnswerIdList,
    getQuestionIdList
  };
}

// DeleteQuestion(question1, "Great! Thin crust or deep dish?");
// DeleteAnswer("a4");
// DeleteAnswer("a6");

// Example usage for AddQuestion
// AddQuestion("Do you like pizza?", []);
// AddQuestion("Great! Thin crust or deep dish?", [], "q6");
// AddQuestion("What is your name?", []);
// AddQuestion("What is your wrong with you?", []);
// AddQuestion("cheese or tomatoes?", []);

// // Example usage for AddAnswer
// AddAnswer("Yes", ["q1"], "q2");
// AddAnswer("No", ["q1"], null);
// AddAnswer("Thin crust", ["q2"], "q5");
// AddAnswer("Deep dish", ["q2"], "q3");
// AddAnswer("cheese", ["q5"],'q3');
// AddAnswer("tomatoes", ["q5"],'q3');

// Example usage for AddQuestionsAndAnswers
// Example usage for AddQuestionsAndAnswers
// Example usage for AddQuestionsAndAnswers
const exampleQuestions = [
  "Do you like pizza?",
  "Great! Thin crust or deep dish?",
  "What is your name?",
  "What is your wrong with you?",
  "cheese or tomatoes?",
];

const exampleAnswers = [
  "Yes",
  "No",
  "Thin crust",
  "Deep dish",
  "cheese",
  "tomatoes",
];

const answerNextQuestionConfigs = {
  0: 1,
  1: 3,
  2: 4,
  4: 2,
  5: 2,
};

const defaultNextQuestionConfigs = {
  0: 3,
};

const questionsAnswerConfigs = {
  0: [0, 1],
  1: [2, 3],
  2: [],
  3: [],
  4: [4, 5],
};

const questionTree = QuestionTree((questions) => "ch" + (Object.keys(questions).length + 1), (answers) => "tl" + (Object.keys(answers).length + 1));
questionTree.addQuestionsAndAnswers(
  exampleQuestions,
  exampleAnswers,
  answerNextQuestionConfigs,
  defaultNextQuestionConfigs,
  questionsAnswerConfigs
);
questionTree.runQuestionTree("q1");
