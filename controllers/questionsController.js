const { Question } = require("../models/questionModel");
const Factory = require("./factoryController");
const catchAsync = require("../utils/catchAsync");

module.exports = class QuestionController {
  static getQuestion = Factory.getOne(Question, { path: "comentarios" });
  static createQuestion = Factory.createOne(Question);
  static deleteQuestion = Factory.deleteOne(Question);
  static updateQuestion = Factory.updateOne(Question);
  static getAllQuestions = Factory.getAll(Question);

  static getData = catchAsync(async (req, res, next) => {
    console.log(req.body);
    let topics, subtopics;
    if (req.body.params.materia) {
      topics = await Question.aggregate([
        {
          $match: { materia: req.body.params.materia },
        },
        {
          $group: {
            _id: "$materia",
            temas: { $addToSet: "$temas" },
          },
        },
        {
          $project: { _id: 0 },
        },
      ]);
    } else {
      subtopics = await Question.aggregate([
        {
          $match: { temas: req.body.params.temas },
        },
        {
          $group: {
            _id: "$temas",
            subtemas: { $addToSet: "$subtemas" },
          },
        },
        {
          $project: { _id: 0 },
        },
      ]);
    }

    const data =
      subtopics !== undefined ? subtopics[0].subtemas : topics[0].temas;
    res.status(200).json({
      status: "success",
      results: data.length,
      locals: data,
    });
  });

  static addUploadedBy = (req, res, next) => {
    req.body.subido_por = req.user.nombre;
    next();
  };
};
