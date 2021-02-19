const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    comentario: {
      type: String,
      required: [true, "Los comentarios no pueden estar vacios"],
      trim: true,
    },
    fechaCreación: {
      type: Date,
      default: Date.now(),
    },
    usuario: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "El comentario debe pertenecerle a un usuario"],
    },
    quiz: {
      type: mongoose.Schema.ObjectId,
      ref: "Question",
      required: [true, "El comentario debe pertenecerle a una pregunta"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Review = mongoose.model("Review", reviewSchema, "comentarios");
module.exports = Review;
