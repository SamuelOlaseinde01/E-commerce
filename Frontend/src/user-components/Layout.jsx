import {
  AccountCircle,
  HistoryEdu,
  Logout,
  Person,
  Shop,
  ShoppingCart,
  ShoppingCartCheckout,
} from "@mui/icons-material";
import React from "react";
import { Link, Outlet, redirect, useLoaderData } from "react-router-dom";
import { getProfile } from "./user-api";

export async function loader() {
  try {
    const { userInfo } = await getProfile();
    return userInfo;
  } catch (err) {
    return err;
  }
}

export default function Layout() {
  const profile = useLoaderData();
  const [profileState, setProfileState] = React.useState(false);
  const firstname = profile?.firstname?.charAt(0).toUpperCase();
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    function handleOutsideClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setProfileState(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div>
      <header>
        <h1>LuxeNest</h1>
        <nav>
          <div className="cart">
            <ShoppingCart />
          </div>
          {profile?.profilePicture ? (
            <div className="logged-profile-icon">
              {!profile?.profilePicture?.url ? (
                <div
                  className="logged-profile-icon-container"
                  ref={containerRef}
                >
                  <h3 onClick={() => setProfileState((prev) => !prev)}>
                    {firstname}
                  </h3>
                  {profileState && (
                    <div className="profile-container">
                      <div className="img-email">
                        <h3
                          style={{ textTransform: "capitalize" }}
                          className="h3"
                        >
                          {firstname}
                        </h3>
                        <p>{profile?.user?.email}</p>
                      </div>
                      <div>
                        <Link to={"/profile"}>
                          <AccountCircle />
                          Account info
                        </Link>
                        <Link to={"/orders"}>
                          <ShoppingCartCheckout /> Orders
                        </Link>
                        <Link
                          to={"/logout"}
                          onClick={() => {
                            localStorage.clear();
                            setProfileState((prev) => !prev);
                          }}
                        >
                          <Logout />
                          Log out
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="logged-profile-icon-container"
                  ref={containerRef}
                >
                  <img
                    src={profile?.profilePicture?.url}
                    alt="user picture"
                    onClick={() => setProfileState((prev) => !prev)}
                  />
                  {profileState && (
                    <div className="profile-container">
                      <div className="img-email">
                        <img
                          src={profile?.profilePicture?.url}
                          alt="user picture"
                        />
                        <h3 style={{ textTransform: "capitalize" }}>
                          {profile?.firstname}
                        </h3>
                        <p>{profile?.user?.email}</p>
                      </div>
                      <div>
                        <Link to={"/profile"}>
                          <AccountCircle />
                          Account info
                        </Link>
                        <Link to={"/orders"}>
                          <ShoppingCartCheckout /> Orders
                        </Link>
                        <Link
                          to={"/logout"}
                          onClick={() => {
                            localStorage.clear();
                            setProfileState((prev) => !prev);
                          }}
                        >
                          <Logout />
                          Log out
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="profile-icon" ref={containerRef}>
              <div
                className="user-icon"
                onClick={() => setProfileState((prev) => !prev)}
              >
                <AccountCircle />
              </div>
              {profileState && (
                <div className="login">
                  <Link to={"/login"}>
                    <AccountCircle />
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
