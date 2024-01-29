
const resultSchema = require('../results/resultSchema');
const quizSchema = require("./quizSchema");
const questionSchema = require("./questionSchema");
const { default: mongoose } = require('mongoose');

module.exports.createQuiz = async (req, res) => {
  
  // console.log("///////////////////////entry//////////////////////",req.body);
  const { quizName, time, quizType, questionDetails, userId} = req.body;
  console.log(quizName, time, quizType, questionDetails);
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
      time:time,
      quizType:quizType,
      userId:userId
    });

 
    for(let quesObj of questionDetails){

    const questions = await questionSchema.create({
      question: quesObj.question,
      optionType:quesObj.optionType,
      options: quesObj.options,
      answer:quesObj.answer,
      time:time,
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
 
  console.log('entery getQuestions');
  try {

    let quizObjectId = new mongoose.Types.ObjectId(req.params.quizId);
// console.log("quizId",quizId);
   
let data = await quizSchema.updateOne(
  {
    _id: quizObjectId,
  },
  {
    $inc: {
      'impressions': 1,
    },
  }
);

    const fetchQuestions = await questionSchema.aggregate([
      {
        $match: {
          quizId: quizObjectId,
        },
      },
     
    ]);

  

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


module.exports.updateQuiz = async (req, res) => {

  
  // console.log("///////////////////////entry//////////////////////",req.body);
  const { quizId, quizName, time, quizType, questionDetails, userId} = req.body;
  console.log("quizIdqqqqqqqqw",req.body)

  try {
    
  let quizObjectId = new mongoose.Types.ObjectId(quizId);
   
  
    const quizSubmit = await quizSchema.updateOne(
      { _id: quizObjectId }, 
      {
        $set: 
          {
            name: quizName,
            time:time,
            quizType:quizType,
            userId:userId
          }
      },
    );

    await questionSchema.deleteMany({quizId: quizObjectId});

    console.log("question deleted");

    for(let quesObj of questionDetails){

    const question = await questionSchema.create(
     {
      question: quesObj.question,
      optionType:quesObj.optionType,
      options: quesObj.options,
      answer:quesObj.answer,
      time:time,
      quizType:quizType,
      quizId: quizObjectId
    });

   
    
  }


  // console.log("question",question);
    res.status(200).send(quizSubmit);
  } catch (error) {
    res.status(500).send({ "error message": error });
  }

}


