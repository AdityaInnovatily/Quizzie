const { getQuestions, uploadQuiz } = require("./quizService");
const router = require("express").Router();

router.post("/uploadquiz", uploadQuiz);
router.get("/getquestions/:quizId", getQuestions);


module.exports = router;
