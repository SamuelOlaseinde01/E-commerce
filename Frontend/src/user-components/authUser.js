import { redirect } from "react-router-dom";

export async function authUser() {
  const isLoggedIn = localStorage.getItem("userToken");

  if (!isLoggedIn) {
    throw redirect(`/login?msg="You must login"`);
  }
}
