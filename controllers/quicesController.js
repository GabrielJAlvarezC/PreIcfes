const Quiz = require("../models/quizModel");
const Factory = require("./factoryController");
const catchAsync = require("../utils/catchAsync");
const { Question } = require("../models/questionModel");
const User = require("../models/userModel");

module.exports = class QuizController {
  static getQuiz = Factory.getOne(Quiz, { path: "preguntas" });
  static deleteQuiz = Factory.deleteOne(Quiz);
  static updateQuiz = Factory.updateOne(Quiz);
  //static createQuiz = Factory.createOne(Quiz);
  static getAllQuizs = Factory.getAll(Quiz);

  static setUserID = (req, res, next) => {
    req.body.usuarios = req.user.id;
    next();
  };

  static joinQuiz = (req, res, next) => {
    req.body = {
      $push: {
        usuarios: req.user.id,
      },
    };
    next();
  };

  static createQuiz = catchAsync(async (req, res, next) => {
    const questions = await Question.aggregate([
      {
        $match: {
          materia: req.body.materia,
          temas: req.body.temas,
          subtemas: req.body.subtemas,
          dificultad: parseInt(req.body.dificultad),
        },
      },
      {
        $sample: { size: parseInt(req.body.nPreguntas) },
      },
    ]);
    const quiz = await Quiz.create(req.body);
    const user = await User.findById(req.user.id);
    user.quices = quices._id;
    quiz.preguntas = questions;
    await user.save({ validateBeforeSave: false });
    await quiz.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      quiz,
    });
  });
};
