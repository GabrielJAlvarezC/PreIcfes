const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  nombre: {
    type: mongoose.Schema.ObjectId,
    ref: "Quiz",
    required: [true, "Las calificaciones deben pertenecerle a un quiz"],
  },
  profesor: {
    type: mongoose.Schema.ObjectId,
    ref: "Professor",
    required: [true, "Todo curso debe tener un profesor"],
  },
  estudiantes: {
    type: [mongoose.Schema.ObjectId],
    ref: "Student",
    required: [true, "Todo curso debe tener estudiantes"],
  },
  materia: {
      type: String,
      required: [true, "El curso debe tener una materia"],
  },
  fechaCreacion: {
      type: Date,
      default: Date.now(),
  },
  fechaFinalizacion: Date
});

const Course = mongoose.model("Course", courseSchema, "Cursos");
module.exports = Course;
