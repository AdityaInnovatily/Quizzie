const resultSchema = require('./resultSchema');
const questionSchema = require("../quiz/quizSchema");
// const {emailService} = require("../emailService");
const userSchema = require("../users/userSchema");

module.exports.saveResults = async (req, res) => {

    let isCandAlreadySubmitted = await resultSchema.findOne({emailId: req.body.emailId});

    if(isCandAlreadySubmitted){
        return res.send(`${isCandAlreadySubmitted.emailId} is already submitted`);
    }


    let user = await userSchema.findOne({email: req.body.emailId});

    if(!user){
        return res.send(`${req.body.emailId} is not registered`);
    }

    let total = 10;
    let attempted = 0;
    let skipped = 0;
    let score = 0;

    let submissions = req.body.submission;

    for (let submission of submissions) {
        if (submission.userAnswer) {
            attempted++;
            let questionData = await questionSchema.findOne({ _id: submission.questionId });
            score += (questionData.answer === submission.userAnswer) ? 1 : 0;
        } else {
            skipped++;
        }
    }

    try {
        let result = new resultSchema({
            userId: user._id.toString(),
            emailId: user.email,
            userName: user.firstName + " " + user.lastName,
            phoneNo: user.phoneNo,
            submission: req.body.submission,
            totalQuestions: total,
            attemptedQuestions: attempted,
            skippedQuestions: skipped,
            userScore: score
        });
        // console.log("Result ==> ", result);
        const data = await result.save();

        // await emailService(process.env.EMAIL_TO, +(process.env.EMAIL_TEMPLATE_SCORE_CARD), user.email, 
        // {
        //     userName: user.firstName + " " + user.lastName,
        //     userEmail:user.email,
        //     phoneNo:user.phoneNo,
        //     attempted:attempted, 
        //     skipped:skipped,
        //     totalScore:score, 
        //     totalQuestions: total
        // });

        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err);
    }
}
