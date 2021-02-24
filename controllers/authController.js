const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const Student = require("../models/studentModel");
const User = require("../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.clave = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};
module.exports = class Autenticacion {
  static signup = catchAsync(async (req, res, next) => {
    let newUser;
    if (req.body.clave === req.body.confirmarClave) {
      newUser = await Student.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        clave: req.body.clave,
        confirmarClave: req.body.confirmarClave,
        // Gracias a strict podemos meter propiedades no especificadas en el Schema, ahora solo toca hacer un if dependiendo del rol
        grado: req.body.grado,
        jornada: req.body.jornada,
      });
      console.log(await Student.find());
    } else {
      return next(new AppError("Las contraseñas no coinciden", 400));
    }
    createSendToken(newUser, 200, res);
  });

  static login = catchAsync(async (req, res, next) => {
    const { correo, clave } = req.body;
    if (!correo || !clave) {
      return next(
        new AppError("Por favor ingrese un correo o contraseña", 400)
      );
    }
    const user = await User.findOne({ correo }).select("+clave");
    if (!user || !(await user.correctPasswords(clave, user.clave))) {
      return next(new AppError("Correo o contraseña incorrectos", 401));
    }

    createSendToken(user, 200, res);
  });

  static protect = catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError("Por favor inicie sesión", 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("El usuario con el token dado ya no existe", 401)
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "Se ha cambiado la contraseña recientemente, Por favor iniciar sesión de nuevo",
          401
        )
      );
    }
    res.locals.user = currentUser;
    req.user = currentUser;
    next();
  });

  static isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );

        // 2) Check if the user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }

        // 3)
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }
        res.locals.user = currentUser;
        req.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

  static restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.rol)) {
        return next(
          new AppError("No tienes permiso para realizar esta acción", 403)
        );
      }
      next();
    };
  };

  static forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ correo: req.body.correo });
    if (!user) {
      return next(new AppError("No existe un usuario con el correo dado", 404));
    }

    const resetToken = createPasswordResetToken();

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/usuarios/reestablecerContraseña/${resetToken}`;
    const message = `Olvidates tu contraseña por favor ingresa a la siguiente url: ${resetURL} para reestablecer tu contraseña\nSi recuerdas tu contraseña por favor ignora este mensaje`;

    try {
      await sendEmail({
        correo: req.body.correo,
        subject: "Tu token de restauración (Valido por 10 minutos)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "El token se ha enviado al correo",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "Hubo error enviando el correo por favor intenta mas tarde!",
          500
        )
      );
    }
  });

  static resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({ passwordResetToken: hashedToken });
    if (!user) {
      return next(new AppError("No existe un usuario con el correo dado", 404));
    }

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
  });

  static updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    if (
      !user ||
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Tu contraseña actual es incorrecta", 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
  });

  static logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: "success" });
  };
};
