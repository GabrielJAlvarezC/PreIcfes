import { Login } from "../axios/login";

const signupForm = document.querySelector(".formSignup");

export class SignupDOM {
  static singup = function () {
    if (signupForm) {
      signupForm.addEventListener("submit", function (e) {
        console.log("hola");
        e.preventDefault();
        const nombre = document.getElementById("username").value;
        const apellido = document.getElementById("lastname").value;
        const correo = document.getElementById("email").value;
        const clave = document.getElementById("password").value;
        const confirmarClave = document.getElementById("passwordConfirm").value;
        const grado = document.getElementById("grade").value;
        const jornada = document.getElementById("jornada").value;
        Login.signup(
          nombre,
          apellido,
          correo,
          clave,
          confirmarClave,
          grado,
          jornada
        );
      });
    }
  };
}
