import axios from "axios";

export class Question {
  static async createQuestion(
    pregunta,
    opciones,
    respuesta,
    materia,
    temas,
    subtemas,
    dificultad,
    formato
  ) {
    try {
      const res = await axios({
        method: "POST",
        url: "http://127.0.0.1:5000/api/v1/pregunta",
        data: {
          pregunta,
          opciones,
          respuesta,
          materia,
          temas,
          subtemas,
          dificultad,
          formato,
        },
      });
      if (res.data.status === "success") {
        window.setTimeout(() => {
          location.assign("/perfil");
        }, 1500);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
