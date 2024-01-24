const mongoose = require("mongoose");

const ResultSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    submission: {
      type: [
        {
          questionId: {
            type: String,
          },
          question: {
            type: String,
          },
          userAnswer: {
            type: String,
          },
        }
      ],
      required: true,
      _id: false,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    attemptedQuestions: {
      type: Number,
      required: true,
    },
    skippedQuestions: {
      type: Number,
      required: true,
    },
    userScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Results", ResultSchema);