const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  pregunta: {
    type: String,
    required: [true, "Una pregunta no puede estar vacia"],
    trim: true,
  },
  opciones: {
    type: [String],
    required: [true, "Toda pregunta debe tener opciones de respuesta"],
  },
  formato: {
    type: String,
    enum: {
      values: ["Verdadero o Falso", "Seleccion Multiple", "Multiple Respuesta"],
      message:
        "Las preguntas son verdadero o falso, selección multiple, múltiple respuesta o abiertas",
    },
    required: [true, "La preguntas deben tener un formato"],
  },
  dificultad: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    required: [true, "Las preguntas deben tener una dificultad"],
  },
  materia: {
    type: String,
    enum: {
      values: [
        "Matemáticas",
        "Física",
        "Biología",
        "Español",
        "Inglés",
        "Sociales",
        "Química",
        "Competencias Ciudadanas",
      ],
      message: "La materia no se encuentra",
    },
    required: [true, "Las preguntas deben pertencer a una materia"],
  },
  temas: {
    type: String,
    enum: {
      values: [
        "Cálculo Diferencial",
        "Electromagnetismo",
        "La Célula",
        "Enlaces",
        "Algoritmos",
      ],
      message: "El tema no se encuentra",
    },
    required: [true, "Las preguntas deben pertencer a un tema"],
  },
  subtemas: {
    type: [String],
    enum: {
      values: [
        "Límites",
        "Marcos de Referencia",
        "Mitocondrias",
        "Iónico",
        "Sorting",
      ],
      message: "El subtema no se encuentra",
    },
    required: [true, "Las preguntas deben pertencer a un subtema"],
  },
  autor: {
    type: String,
    trim: true,
  },
  subidoPor: {
    type: String,
    required: [true, "Las preguntas deben tener un autor"],
    trim: true,
  },
  respuesta: {
    type: [Number],
    required: [true, "Toda pregunta debe tener respuestas"],
  },
  referencias: {
    type: String,
  },
});

exports.questionSchema = questionSchema;

questionSchema.pre("save", function (next) {
  if (this.respuesta.type !== Number) {
    this.formato === "multiple respuesta"
      ? (this.respuesta.type = [Number])
      : (this.respuesta.type = String);
  }
  next();
});

questionSchema.path("dificultad").options.enum;

exports.Question = mongoose.model("Question", questionSchema, "preguntas");

//module.exports = Question;
