const { getQuestions, createQuiz, updateQuestionResponse,getQuizList,deleteQuiz } = require("./quizService");
const router = require("express").Router();

router.post("/createQuiz", createQuiz);
router.get("/getquestions/:quizId", getQuestions);
router.post("/updateQuestionResponse", updateQuestionResponse);
router.get("/getQuizList/:userId", getQuizList);
router.post("/deleteQuiz", deleteQuiz);


module.exports = router;
