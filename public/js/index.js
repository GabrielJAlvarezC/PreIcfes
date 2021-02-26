import "@babel/polyfill";
import { LoginDOM } from "./pages/login";
import { SignupDOM } from "./pages/signup";
import { QuestionForm } from "./forms/questionForm";
// HomePage
LoginDOM.login();
LoginDOM.animationInput();

// Sign-up page
SignupDOM.signup();
// Question Form

if (document.URL === 'http://127.0.0.1:3000/questions/create') {
    
    QuestionForm.showPage();
    QuestionForm.removeData();
    QuestionForm.showTopics();
    QuestionForm.showSubTopics();
}
