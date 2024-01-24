const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    optionType:{
      type:String,
      required:true
    },
    options: {
      type: [
          {
            text: {type:String},
            image: {type:String}
        }
        
      ],
      required: true,
      _id:false
    },
    answer: {
      type: String,
      required: true,
    },
    quizId: {type:Schema.Types.ObjectId, ref: "Quiz"},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Questions", QuestionSchema);
