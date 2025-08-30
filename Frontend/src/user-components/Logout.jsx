import React from "react";
import { Link } from "react-router-dom";

export default function Logout() {
  return (
    <div className="logout-container">
      <h1>Logout</h1>
      <hr />
      <h3>You've been successfully logged out.</h3>
      <Link to={"/products"}>Click here to continue...</Link>
    </div>
  );
}
