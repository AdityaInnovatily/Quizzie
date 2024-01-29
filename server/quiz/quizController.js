const { getQuestions, createQuiz, updateQuestionResponse,getQuizList,deleteQuiz, updateQuiz } = require("./quizService");
const router = require("express").Router();

router.post("/createQuiz", createQuiz);
router.get("/getquestions/:quizId", getQuestions);
router.post("/updateQuestionResponse", updateQuestionResponse);
router.get("/getQuizList/:userId", getQuizList);
router.post("/deleteQuiz", deleteQuiz);
router.post("/updateQuiz", updateQuiz);


module.exports = router;
