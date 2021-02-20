import "@babel/polyfill";
import { LoginDOM } from "./homePage/login";
import { SignupDOM } from "./signupPage/signup";

// HomePage
LoginDOM.login();
LoginDOM.animationInput();

// Sign-up page
SignupDOM.singup();
