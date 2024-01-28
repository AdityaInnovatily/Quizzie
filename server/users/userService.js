const userSchema = require("./userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


module.exports.registerUser = async (req, res) => {
  try {

    const { name, email, password} = req.body;

    // console.log("name",name,email,password);

    if (!name || !email || !password ) {

      return res.send("Please, fill details completely");

    }else {

      const userDetails = await userSchema.findOne({ email: email });
      
      console.log(userDetails);
      if (userDetails) {
        res.send({msg:`${email} already exist`});
      } else {


          const hashedPassword = await bcrypt.hash(password, 10);
        
        let userResponse = await userSchema.create({
          name: name,
          email:email,
          password:hashedPassword
        });
        console.log("userResponse", userResponse);
        res.status(201).send({
          name:userResponse.name,
          email: userResponse.email, 
          createdAt: userResponse.createdAt,
          status:201});

      }
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error',error);
  }
};


module.exports.login = async (req, res,next) => {
  
    const { email, password } = req.body;
    console.log("sdf",req.params,email,password);
    const user = await userSchema.findOne({ email: email });

    if (!user){
      return res.send({ msg: `oops!, ${email} does not exist`});
    }else{
   
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid){
      return res.send({ msg: "Incorrect Password"});
    }

    const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: '1d'});

    return res.send({token: token, userDetails: user});

  }
  
};

module.exports.getUsers = async (req, res) => {

  try {

    const users = await userSchema.aggregate([
      {
        $lookup: {
          from: 'results',
          localField: 'email',
          foreignField: 'emailId',
          as: 'result'
        }
      },
      {
        $project: {
          email: 1,
          userName: { $concat: ['$firstName', ' ', '$lastName'] },
          testResults: {
            $map: {
              input: '$result',
              as: 'test',
              in: {
                userSubmissions: '$$test.submission',
                totalQuestion: '$$test.totalQuestions',
                score: '$$test.userScore',
              }
            }
          }
        }
      }
    ]);

    res.status(200).send(users);
  } catch (err) {
    console.log("Error : ", err.message);
    res.status(500).send('Internal Server Error');
  }
};

