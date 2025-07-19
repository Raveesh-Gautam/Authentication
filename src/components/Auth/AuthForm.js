import { useContext, useRef, useState } from "react";
import classes from "./AuthForm.module.css";
import AuthContext from "../../store/auth-context";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx=useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    setError(null); 

    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCcdnEG8GsxuNaeSVGU1kjK66bkn5OB03k`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCcdnEG8GsxuNaeSVGU1kjK66bkn5OB03k`;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {

          return res.json();
        } else {
          return res.json().then((data) => {
            const errorMessage =
              data.error?.message || "Authentication failed!";
              console.log(data.error.message);
            alert("Authentication failed!");
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log("Success:", data);
        console.log("Success:", data);
        const token = data.idToken;
        authCtx.login(data.idToken);
        localStorage.setItem("token", token);
        alert("Authentication successful!");
      })
      .catch((err) => {
       console.log(setError(err.message));
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>

        <div className={classes.actions}>
          {!isLoading && (
            <button disabled={isLoading}>
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}
          {isLoading && <p>Loading...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
        {error && <p className={classes.error}>{error}</p>}
      </form>
    </section>
  );
};

export default AuthForm;
