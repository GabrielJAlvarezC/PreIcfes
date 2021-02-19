import "@babel/polyfill";
import { Login } from "./login";

// Elementos HTML
const loginForm = document.querySelector(".formLogin");
const signupForm = document.querySelector(".formSignup");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = document.getElementById("email").value;
    const clave = document.getElementById("password").value;
    Login.login(correo, clave);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
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
