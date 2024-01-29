const mongoose = require("mongoose");

const QuizSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    impressions: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    quizType: {
      type: String,
      required: true,
      // description:"either poll or qna"
    },
    userId:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", QuizSchema);
