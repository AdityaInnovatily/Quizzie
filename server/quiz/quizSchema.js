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
    timer: {
      type: Number,
      required: true,
    },
    quizType: {
      type: String,
      required: true,
      description:"either poll or qna"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", QuizSchema);
