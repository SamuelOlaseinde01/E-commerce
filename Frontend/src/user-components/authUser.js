import { redirect } from "react-router-dom";

const isLoggedIn = localStorage.getItem("userToken");

if (!isLoggedIn) {
  throw redirect(`/login?msg="You must login"`);
}
