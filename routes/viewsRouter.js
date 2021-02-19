const express = require("express");
const ViewsController = require("../controllers/viewsController");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.get("/", ViewsController.getHomePage);
router.get("/registro", ViewsController.getSignupForm);

router.use(AuthController.isLoggedIn);
router.get("/perfil", ViewsController.getProfile);

router.get("/quiz/:quizId", ViewsController.getQuiz);

router.get("/questions/create", ViewsController.getQuestionForm);

router.get("/quiz", ViewsController.createQuiz);
module.exports = router;
