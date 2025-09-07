import React from "react";
import {
  Visibility,
  VisibilityOff,
  LockOutline,
  MailOutline,
  Warning,
} from "@mui/icons-material";
import {
  Form,
  useNavigation,
  Link,
  useActionData,
  redirect,
} from "react-router-dom";
import { login } from "./user-api";

export async function action({ request }) {
  const formData = await request.formData();
  const creds = Object.fromEntries(formData.entries());
  try {
    await login(creds);
    return redirect("/products");
  } catch (error) {
    return error;
  }
}

export default function Login() {
  const navigation = useNavigation();
  const error = useActionData();
  const [type, setType] = React.useState("password");
  const [visibility, setVisibility] = React.useState(false);
  console.log(error);

  function handleClick() {
    setVisibility((prev) => !prev);
    setType((prev) => (prev === "password" ? "text" : "password"));
  }
  return (
    <div className="user-login">
      <div className="user-login-container">
        <h1>Sign in</h1>
        <Form method="post" className="form">
          <div className="label-container">
            <label htmlFor="email">Email:</label>
            <div className="input-container">
              <div className="lock">
                <MailOutline />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className={error?.field === "email" ? "error-input" : null}
                placeholder="Enter your email address"
                required
              />
            </div>
            {error?.field === "email" && (
              <h5>
                <Warning />
                {error.msg}
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
                className={error?.field === "password" ? "error-input" : null}
                placeholder="Enter your password"
                required
              />
              <div className="eye" onClick={handleClick}>
                {visibility ? <Visibility /> : <VisibilityOff />}
              </div>
            </div>
            {error?.field === "password" && (
              <h5>
                <Warning />
                {error.msg}
              </h5>
            )}{" "}
          </div>
          <button
            className={
              navigation.state === "submitting" ? "loading-btn" : "default-btn"
            }
          >
            {navigation.state === "submitting" ? "Signing in..." : "Sign in"}
          </button>
          <p>
            Don't have an account? <Link to={"/register"}>Sign up</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
