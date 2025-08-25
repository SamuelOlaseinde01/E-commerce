import React from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  redirect,
} from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  Warning,
  LockOutline,
  MailOutline,
} from "@mui/icons-material";
import { register } from "./user-api";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const cpassword = formData.get("cpassword");
    if (password != cpassword) {
      return { msg: "Password do not match", field: "password" };
    }
    const obj = {
      email,
      password,
    };
    await register(obj);
    return redirect("/complete-profile");
  } catch (error) {
    return error;
  }
}

export default function Register() {
  const navigation = useNavigation();
  const msg = useActionData();
  const [type, setType] = React.useState("password");
  const [visibility, setVisibility] = React.useState(false);
  const [cptype, setCpType] = React.useState("password");
  const [cpVisibility, setCpVisibility] = React.useState(false);

  function handleClick() {
    setVisibility((prev) => !prev);
    if (!visibility) {
      setType("text");
    } else if (visibility) {
      setType("password");
    }
  }

  function handleCpClick() {
    setCpVisibility((prev) => !prev);
    if (!cpVisibility) {
      setCpType("text");
    } else if (cpVisibility) {
      setCpType("password");
    }
  }

  return (
    <>
      <div className="user-register">
        <div className="user-register-container">
          <h1>Sign Up</h1>
          <Form method="post" className="form">
            <div className="label-container">
              <label htmlFor="email">Email:</label>
              <div className="input-container">
                <div className="lock">
                  <MailOutline />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className={msg?.field === "email" ? "error-input" : null}
                  required
                />
              </div>
              {msg?.field === "email" && (
                <h5>
                  <Warning />
                  {msg.msg}
                </h5>
              )}
            </div>
            <div className="label-container">
              <label htmlFor="password">Password:</label>
              <div className="input-container">
                <div className="lock">
                  <LockOutline />
                </div>
                <input
                  id="password"
                  type={type}
                  name="password"
                  placeholder="Enter your password"
                  required
                />
                <div className="eye" onClick={handleClick}>
                  {visibility ? <Visibility /> : <VisibilityOff />}
                </div>
              </div>
            </div>
            <div className="label-container">
              <label htmlFor="cpassword">Confirm password:</label>
              <div className="input-container">
                <div className="lock">
                  <LockOutline />
                </div>
                <input
                  id="cpassword"
                  type={cptype}
                  name="cpassword"
                  placeholder="Confirm your password"
                  className={msg?.field === "password" ? "error-input" : null}
                  required
                />
                <div className="eye" onClick={handleCpClick}>
                  {cpVisibility ? <Visibility /> : <VisibilityOff />}
                </div>
              </div>
              {msg?.field === "password" && (
                <h5>
                  <Warning />
                  {msg.msg}
                </h5>
              )}
            </div>
            <button
              className={
                navigation.state === "submitting"
                  ? "loading-btn"
                  : "default-btn"
              }
            >
              {navigation.state === "submitting" ? "Signing up..." : "Sign up"}
            </button>
            <p>
              Already have an account?<Link to={"/login"}>Sign in</Link>
            </p>
          </Form>
        </div>
      </div>
    </>
  );
}
