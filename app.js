const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const path = require("path");

const viewRouter = require("./routes/viewsRouter");
const questionRouter = require("./routes/questionsRouter");
const userRouter = require("./routes/usersRouter");
const quizRouter = require("./routes/quicesRouter");
const { globalErrorHandler } = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

app.use(morgan("dev"));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});

app.use("/api", limiter);
app.use(express.json({ limit: "500kb" }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  next();
});

// Rutas:
app.use("/", viewRouter);
app.use("/api/v1/pregunta", questionRouter);
app.use("/api/v1/usuarios", userRouter);
app.use("/api/v1/quiz", quizRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`La página ${req.originalUrl} no se ha encontrado`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
