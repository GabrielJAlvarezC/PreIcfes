import axios from "axios";

export class Quiz {
  static sendDataToQuiz = async function (
    nombre,
    materia,
    temas,
    nPreguntas,
    duracion,
    subtemas,
    dificultadPromedio
  ) {
    try {
      const res = await axios({
        method: "POST",
        url: `http://127.0.0.1:5000/api/v1/quiz`,
        data: {
          nombre,
          materia,
          temas,
          nPreguntas,
          duracion,
          subtemas,
          dificultadPromedio,
        },
      });
      if (res.data.status === "success") {
        window.setTimeout(() => {
          const url = `/quiz/${res.data.quiz._id}`;
          location.assign(`${url}`);
        }, 1500);
      }

      return res.data.quiz;
    } catch (err) {
      console.log("Hubo un serio error gilipollas!!!");
    }
  };

  static getQuiz = async function (quizId) {
    const res = await axios(`http://127.0.0.1:5000/api/v1/sesiones/${quizId}`);
    console.log(res);
    return res.data.preguntas;
  };

  static updateUsersQuiz = async function (quizId) {
    try {
      await axios.patch(`http://127.0.0.1:5000/api/v1/sesiones/${quizId}`, {
        usuarios: "hello",
      });
    } catch (err) {
      console.log(err);
    }
  };
}
