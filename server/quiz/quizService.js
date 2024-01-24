
const resultSchema = require('../results/resultSchema');
const quizSchema = require("./quizSchema");
const questionSchema = require("./questionSchema");
const { default: mongoose } = require('mongoose');

module.exports.uploadQuiz = async (req, res) => {

  const { quizName, timer, quizType, questionName, optionType,options, answer} = req.body;

  try {
    let findQuiz = await quizSchema.findOne({name: questionName});
    console.log("sdfds",findQuiz);
    if(findQuiz){
      return res.status(500).send("oops!, quiz name already exist");
    }

    const result = await quizSchema.create({
      name: quizName,
      impressions:0,
      timer:timer,
      quizType:quizType
    });

 
    const questions = await questionSchema.create({
      question: questionName,
      optionType:optionType,
      options: options,
      answer:answer,
      quizId: result
    });
    
    res.status(200).send(questions);
  } catch (error) {
    res.status(500).send({ "error message": error });
  }

}

// This will get the random questions based on the requested language
module.exports.getQuestions = async (req, res) => {
 
  try {

    let quizId = new mongoose.Types.ObjectId(req.params.quizId);

    const fetchQuestions = await questionSchema.aggregate([
      {
        $match: {
          quizId: quizId,
        }
      }
    ]);
    res.status(200).json(fetchQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
