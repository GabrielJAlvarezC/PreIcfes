const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: "Quiz",
    required: [true, "Las calificaciones deben pertenecerle a un quiz"],
  },
  estudiante: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Las calificaciones deben pertenecerle a un estudiante"],
  },
  nota: {
    type: Number,
    required: [true, "El estudiate debe tener una nota"],
  },
  tiempo: {
    type: Number,
  },
});

const Score = mongoose.model("Calificacion", scoreSchema, "calificaciones");

module.exports = Score;
