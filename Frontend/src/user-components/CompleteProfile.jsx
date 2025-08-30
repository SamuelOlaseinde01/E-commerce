import React from "react";
import {
  Form,
  redirect,
  useActionData,
  Link,
  useNavigation,
} from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { createProfile, getProfile } from "./user-api";
import { authUser } from "./authUser";
import { Warning } from "@mui/icons-material";

export async function loader() {
  await authUser();
  const { userInfo } = await getProfile();
  if (userInfo) {
    return redirect("/products");
  }
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const userInfo = await createProfile(formData);
    console.log(userInfo);
    return null;
  } catch (err) {
    return err;
  }
}

export default function CompleteProfile() {
  const error = useActionData();
  const navigation = useNavigation();
  const [value, setValue] = React.useState();
  return (
    <>
      <div className="complete-profile">
        <Link className="skip" to={"/products"}>
          Skip
        </Link>
        <div className="complete-profile-header">
          <h1>Complete Your Registration</h1>
          <p>"Just a few more details to finish up!"</p>
        </div>
        <div className="complete-profile-container">
          <Form method="POST" encType="multipart/form-data">
            <div className="label-container">
              <label htmlFor="firstname">First Name:</label>
              <input
                name="firstname"
                id="firstname"
                type="text"
                className={error?.field === "firstname" ? "error-input" : null}
              />
              {error?.field === "firstname" && (
                <h5>
                  <Warning />
                  {error.msg}
                </h5>
              )}
            </div>
            <div className="label-container">
              <label htmlFor="lastname">Last Name:</label>
              <input
                name="lastname"
                id="lastname"
                type="text"
                className={error?.field === "lastname" ? "error-input" : null}
              />
              {error?.field === "lastname" && (
                <h5>
                  <Warning />
                  {error.msg}
                </h5>
              )}
            </div>
            <div className="label-container">
              <label htmlFor="dateofbirth">Date of Birth:</label>
              <input
                name="dateofbirth"
                id="dateofbirth"
                type="date"
                className={
                  error?.field === "dateofbirth" ? "error-input" : null
                }
              />
              {error?.field === "dateofbirth" && (
                <h5>
                  <Warning />
                  {error.msg}
                </h5>
              )}
            </div>
            <div className="label-container">
              <label htmlFor="phonenumber">Phone Number:</label>
              <PhoneInput
                name="phonenumber"
                placeholder="Enter phone number"
                value={value}
                onChange={setValue}
                className={
                  error?.field === "phonenumber" ? "error-input" : null
                }
              />
              {error?.field === "phonenumber" && (
                <h5>
                  <Warning />
                  {error.msg}
                </h5>
              )}
            </div>
            <div className="label-container">
              <label htmlFor="address">Address:</label>
              <input
                name="address"
                id="address"
                type="text"
                className={error?.field === "address" ? "error-input" : null}
              />
              {error?.field === "address" && (
                <h5>
                  <Warning />
                  {error.msg}
                </h5>
              )}
            </div>
            <div className="label-container">
              <label htmlFor="image">Upload your image(optional):</label>
              <input type="file" id="image" accept="image/*" name="image" />
            </div>
            <button
              className={
                navigation.state === "submitting"
                  ? "cp-loading-btn"
                  : "cp-default-btn"
              }
            >
              {" "}
              {navigation.state === "submitting"
                ? "Saving..."
                : "Save and continue"}
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
