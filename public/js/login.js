import axios from "axios";

export class Login {
  static login = async function (correo, clave) {
    try {
      const res = await axios({
        method: "POST",
        url: "http://127.0.0.1:3000/api/v1/usuarios/iniciarSesion",
        data: {
          correo,
          clave,
        },
      });
      if (res.data.status === "success") {
        window.setTimeout(() => {
          location.assign("/tablero");
        }, 1500);
      }
      console.log(res);
    } catch (err) {
      console.log("Hubo un error");
    }
  };

  static logout = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: "http://127.0.0.1:3000/api/v1/usuarios/cerrarSesion",
      });

      if (res.data.status === "success") location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  static signup = async (
    nombre,
    apellido,
    correo,
    clave,
    confirmarClave,
    grado,
    jornada
  ) => {
    try {
      const res = await axios({
        method: "POST",
        url: "http://127.0.0.1:3000/api/v1/usuarios/registro",
        data: {
          nombre,
          apellido,
          correo,
          clave,
          confirmarClave,
          grado,
          jornada,
        },
      });

      if (res.data.status === "success") {
        window.setTimeout(() => {
          location.assign("/");
        }, 1500);
      }
    } catch (err) {
      console.log(err);
    }
  };
}
