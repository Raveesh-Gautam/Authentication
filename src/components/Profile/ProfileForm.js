import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const passwordInputRef = useRef();
  const location=useHistory();
  const handleForm = (event) => {
    event.preventDefault();
    const newPassword = passwordInputRef.current.value;
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCcdnEG8GsxuNaeSVGU1kjK66bkn5OB03k`,
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: newPassword,
          returnScureToken: false,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        console.log(res.json());
        location.replace('/');
      })
      .catch((err) => {});
  };
  return (
    <form className={classes.form} onSubmit={handleForm}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength={"7"}
          ref={passwordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
