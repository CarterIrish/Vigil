import React from "react";
import { createRoot } from "react-dom/client";
const { handleError, sendPost, hideError } = require("./helper");

const handleLogin = (e) => {
  e.preventDefault();

  const username = e.target.querySelector("#user").value;
  const pass = e.target.querySelector("#pass").value;

  if (!username || !pass) {
    handleError("Username or password is empty");
    return false;
  }

  sendPost(e.target.action, { username, pass });
  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
  hideError();

  const username = e.target.querySelector("#user").value;
  const pass = e.target.querySelector("#pass").value;
  const pass2 = e.target.querySelector("#pass2").value;

  if (!username || !pass || !pass2) {
    handleError("All fields are required");
    return false;
  }

  if (pass !== pass2) {
    handleError("Passwords do not match");
    return false;
  }

  sendPost(e.target.action, { username, pass, pass2 });
  return false;
};

const SignupWindow = () => {
  return (
    <form
      id="signupForm"
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass2">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="password" />
      <input className="formSubmit" type="submit" value="Sign Up" />
    </form>
  );
};

const LoginWindow = () => {
  return (
    <form
      id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <input className="formSubmit" type="submit" value="Sign in" />
    </form>
  );
};

const LoginPage = () => {
  const [isLogin, setisLogin] = React.useState(true);
  return (
    <div>
      {isLogin ? <LoginWindow /> : <SignupWindow />}
      <button onClick={() => setisLogin(!isLogin)}>
        {isLogin
          ? "Dont have an account? Sign up here!"
          : "Already have an account? Sign in here!"}
      </button>
    </div>
  );
};

const init = () => {
  const container = document.getElementById("app");
  if (container) {
    const root = createRoot(container);
    root.render(<LoginPage />);
  }
};

init();
