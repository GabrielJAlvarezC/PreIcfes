const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

module.exports = class Factory {
  static deleteOne = function (Model) {
    return catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndRemove(req.params.id);
      if (!doc) {
        return next(
          new AppError("No hay ningun documento con el ID dado", 404)
        );
      }
      res.status(204).json({
        status: "success",
        data: null,
      });
    });
  };

  static updateOne = function (Model) {
    return catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) {
        return next(
          new AppError("No hay ningun documento con el ID dado", 404)
        );
      }
      res.status(200).json({
        status: "success",
        doc,
      });
    });
  };

  static createOne = function (Model) {
    return catchAsync(async (req, res, next) => {
      const newDoc = await Model.create(req.body);
      res.status(201).json({
        status: "success",
        newDoc,
      });
    });
  };

  static getOne = function (Model, popOptions) {
    return catchAsync(async (req, res, next) => {
      let query = Model.findById(req.params.id);
      if (popOptions) {
        query = query.populate(popOptions);
      }
      const doc = await query;
      if (!doc) {
        return next(
          new AppError("Ningun documento encontrado con el ID dado", 404)
        );
      }

      res.status(200).json({
        status: "success",
        doc,
      });
    });
  };

  static getAll = function (Model) {
    return catchAsync(async (req, res, next) => {
      let filter = {};
      if (req.params.questionId) filter = { question: req.params.questionId };
      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagin();
      const docs = await features.query;
      res.status(200).json({
        status: "success",
        results: docs.length,
        docs,
      });
    });
  };
};
