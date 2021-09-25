import React from "react";
import webChatLogo from "../../Images/web-chat-logo.jfif";
import "./login.css";
import { useState } from "react";
import { useAuth } from "../Context";

const Login = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [isForgetPass, setIsForgetPass] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [passConf, setPassConf] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, logIn, resetPass } = useAuth();
  const handleForgetPasswordClick = (e) => {
    setIsForgetPass(true);
  };
  const handleOnLoginClick = (e) => {
    setIsLogin((prev) => !prev);
  };
  const handleLoginClick = (e) => {
    setIsForgetPass((prev) => !prev);
    setIsLogin(true);
  };
  const handleSignUpClick = (e) => {
    setIsForgetPass((prev) => !prev);
    setIsLogin(false);
  };
  const handlePassReset = async (e) => {
    try {
      setError("");
      setSuccessMessage("");
      await resetPass(email);
      setSuccessMessage("check your inbox for further instructions");
    } catch {
      setError("error in setting the password");
    }
  };
  const handleInputChange = (e) => {
    switch (e.target.id) {
      case "email":
        setEmail(e.target.value);
        break;
      case "pass":
        setPass(e.target.value);
        break;
      case "re-pass":
        setPassConf(e.target.value);
        break;
      default:
        break;
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("button clicked at : ", isLogin);
    try {
      setError("");
      setLoading(true);
      if (isLogin) {
        await logIn(email, pass);
        setEmail("");
        setPass("");
        setPassConf("");
      } else {
        await signUp(email, pass);
        setEmail("");
        setPass("");
        setPassConf("");
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      const errorMsg = isLogin
        ? "Unable to Login"
        : "Failed to create an account";
      setError(errorMsg);
    }
  };

  return (
    <div className="login">
      <div className="login_container">
        {isForgetPass ? (
          <div className="login_forgetPassContainer">
            <h2>Password Reset</h2>
            {error === "" ? (
              ""
            ) : (
              <div className="login_errorContainer">{error}</div>
            )}
            {successMessage === "" ? (
              ""
            ) : (
              <div className="login_successContainer">{successMessage}</div>
            )}
            <input
              type="email"
              id="email"
              onChange={handleInputChange}
              value={email}
              placeholder="Enter email to send password"
              required
            />
            <button onClick={handlePassReset}>Reset Password</button>
            <p onClick={handleLoginClick}>login -{">"}</p>
            <div>
              Create an account ?{" "}
              <span onClick={handleSignUpClick}>signup</span>
            </div>
          </div>
        ) : (
          <>
            <img src={webChatLogo} alt="web-chat" />
            <div className="login_text">
              <h1>{isLogin ? "Log In" : "Sign Up"}</h1>
            </div>
            <form className="login_form" onSubmit={handleSignUp}>
              {error === "" ? (
                ""
              ) : (
                <div className="login_errorContainer">{error}</div>
              )}
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="pass">Password</label>
                <input
                  id="pass"
                  type="password"
                  placeholder="Enter your password"
                  value={pass}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="re-pass">Password Confirmation</label>
                  <input
                    id="re-pass"
                    type="password"
                    placeholder="Re-enter your password"
                    value={passConf}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <button disabled={loading} type="submit">
                {isLogin ? "Log In" : "Sign Up"}
              </button>
            </form>
            {isLogin && (
              <div
                className="login_forgetPasswordSpan"
                onClick={handleForgetPasswordClick}
              >
                <p>Forget Password ?</p>
              </div>
            )}
            <div className="login_footer">
              {isLogin ? "Create an account ? " : "Already have an account ?"}{" "}
              <span onClick={handleOnLoginClick}>
                {isLogin ? "Sign Up" : "Log In"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
