const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Por favor diganos su nombre"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [15, "El nombre debe tener un máximo de 15 caracteres"],
    },

    apellido: {
      type: String,
      required: [true, "Por favor diganos su apellido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [30, "El nombre debe tener un máximo de 30 caracteres"],
    },

    correo: {
      type: String,
      unique: true,
      required: [true, "Por favor dinos tu correo"],
      validate: [validator.isEmail, "Correo invalido"],
      trim: true,
      lowercase: true,
    },

    clave: {
      type: String,
      select: false,
      required: [true, "Por favor digita tu contraseña"],
      trim: true,
      minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
    },

    confirmarClave: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val) {
          return val === this.clave;
        },
        message: "Las contraseñas no coinciden",
      },
      trim: true,
    },

    fechaCreacion: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    rol: {
      type: String,
      default: "estudiante",
      enum: {
        values: ["admin", "estudiante", "contribuidor", "maestro"],
      },
    },

    foto: String,
    quices: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Quiz",
      },
    ],
    activo: {
      default: "true",
      type: Boolean,
      select: false,
    },

    preguntasFavoritas: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Question",
      },
    ],

    ultimoIngreso: Date,
    fechaCambioClave: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    algo: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, strict: false }
);

// Document middlewares:

userSchema.pre("save", async function (next) {
  if (!this.isModified("clave")) return next;
  this.clave = await bcrypt.hash(this.clave, 10);
  this.confirmarClave = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("clave") || this.isNew) return next();
  this.fechaCambioClave = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ activo: { $ne: false } });
  next();
});

// Propiedades virtuales segun el rol
/* userSchema.pre("save", async function (next) {
  if (this.rol === "estudiante") {
    this.grado = "tercero";
  }
}); */

// Metodos de autenticación
userSchema.methods.correctPasswords = async (plainText, contraseña) => {
  return await bcrypt.compare(plainText, contraseña);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.fechaCambioClave) {
    const changedTimeStamp = parseInt(
      this.fechaCambioClave.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema, "usuarios");
module.exports = User;
