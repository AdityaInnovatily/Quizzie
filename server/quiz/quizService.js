
const resultSchema = require('../results/resultSchema');
const quizSchema = require("./quizSchema");
const questionSchema = require("./questionSchema");
const { default: mongoose } = require('mongoose');

module.exports.createQuiz = async (req, res) => {

  
  // console.log("///////////////////////entry//////////////////////",req.body);
  const { quizName, timer, quizType, questionDetails, userId} = req.body;
  // console.log(quizName, timer, quizType, questionDetails);
  // console.log(questionDetails);
  try {
    
    let findQuiz = await quizSchema.findOne({name: quizName});
    console.log("sdfds",findQuiz);
    if(findQuiz){
      return res.send({msg:"oops!, quiz name already exist"});
    }

  
    const quizSubmit = await quizSchema.create({
      name: quizName,
      impressions:0,
      timer:timer,
      quizType:quizType,
      userId:userId
    });

 
    for(let quesObj of questionDetails){

    const questions = await questionSchema.create({
      question: quesObj.questionName,
      optionType:quesObj.optionType,
      options: quesObj.options,
      answer:quesObj.answer,
      time:timer,
      quizType:quizType,
      quizId: quizSubmit
    });
    
  }


  console.log("conood",quizSubmit);
  
    res.status(200).send(quizSubmit);
  } catch (error) {
    res.status(500).send({ "error message": error });
  }

}


// This will get the random questions based on the requested language
module.exports.getQuestions = async (req, res) => {
 
  try {

    let quizObjectId = new mongoose.Types.ObjectId(req.params.quizId);
// console.log("quizId",quizId);
   
    const fetchQuestions = await questionSchema.aggregate([
      {
        $match: {
          quizId: quizObjectId,
        },
      },
     
    ]);
    
    // console.log("fetchQuestions",fetchQuestions.aggregate());

    res.status(200).json(fetchQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports.updateQuestionResponse = async(req,res)=>{
  console.log("reqqqqqqq",req.body);
  let questionObjectId = new mongoose.Types.ObjectId(req.body.questionId);
  let optionObjectId = new mongoose.Types.ObjectId(req.body.optionId);


  let data = await questionSchema.updateOne(
    {
      _id: questionObjectId,
      'options._id': optionObjectId,
    },
    {
      $inc: {
        'options.$.count': 1,
      },
    }
  );

  console.log("data",data);
  res.send("data updated successfully");

}


module.exports.getQuizList = async(req,res)=>{


  const quizList = await quizSchema.aggregate([
    {
      $match: {
        userId: req.params.userId,
      },
    },
   
  ]);
  
  // console.log("fetchQuestions",fetchQuestions.aggregate());

  res.status(200).json(quizList);

}


module.exports.deleteQuiz = async(req,res)=>{

  let quizObjectId = new mongoose.Types.ObjectId(req.body.quizId);

  const deleteQuiz = await quizSchema.deleteOne({_id:quizObjectId});
  
  console.log("deleteQuiz",deleteQuiz);

  res.status(200).json({msg:"quiz deleted"});

}



