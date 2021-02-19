const User = require("../models/userModel");
const Factory = require("./factoryController");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  allowedFields.forEach((el) => (newObj[el] = obj[el]));
  return newObj;
};

module.exports = class UserController {
  static getUser = Factory.getOne(User);
  static deleteUser = Factory.deleteOne(User);
  static updateUser = Factory.updateOne(User);
  static createUser = Factory.createOne(User);
  static getAllUsers = Factory.getAll(User);

  static getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };

  static updateMe = catchAsync(async (req, res, next) => {
    if (req.body.clave || req.body.confirmarClave) {
      return next(
        new AppError(
          "Esta no es la para cambiar la contraseña porfavor dirigete a: /actualizarContraseña"
        )
      );
    }

    const filterBody = filterObj(req.body, "nombre", "correo");

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      updatedUser,
    });
  });

  static deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
      activo: false,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};
