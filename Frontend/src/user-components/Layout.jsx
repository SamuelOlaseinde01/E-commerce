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
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { addToCart, getCart, getProfile } from "./user-api";

export async function loader() {
  try {
    let cart = [];
    const { userInfo: profile, user } = await getProfile();
    if (!user && profile) {
      if (localStorage.getItem("cart")) {
        const lcCart = JSON.parse(localStorage.getItem("cart"));
        const { cart: mergedCart } = await addToCart(lcCart);
        localStorage.removeItem("cart");
        return { profile, cart: mergedCart.items };
      }
      cart = await getCart();
      return { profile, cart: cart.items };
    }
    if ((!user && !profile) || (user && !profile)) {
      cart = JSON.parse(localStorage.getItem("cart"));
      return { cart };
    }
    return { profile, email: user.email, cart };
  } catch (err) {
    return err;
  }
}

export default function Layout() {
  const { profile, email, cart } = useLoaderData();
  const [profileState, setProfileState] = React.useState(false);
  const [isLoaded, setLoaded] = React.useState(false);
  const firstname = profile?.firstname?.charAt(0).toUpperCase();
  const fullName = `${profile?.firstname} ${profile?.lastname}`;
  const containerRef = React.useRef(null);

  const profilePicUrl = profile?.profilePicture?.url;
  const profileEmail = profile?.user?.email;

  console.log(useLoaderData());

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
            <h1>{cart?.length}</h1>
          </div>
          {(profile?.firstname && (
            <div className="logged-profile-icon">
              <div className="logged-profile-icon-container" ref={containerRef}>
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="user picture"
                    onClick={() => setProfileState((prev) => !prev)}
                  />
                ) : (
                  <h3 onClick={() => setProfileState((prev) => !prev)}>
                    {firstname}
                  </h3>
                )}
                {profileState && (
                  <div className="profile-container">
                    <div className="img-email">
                      {profilePicUrl ? (
                        <img
                          src={profilePicUrl}
                          alt="user picture"
                          onLoad={() => setLoaded(true)}
                        />
                      ) : (
                        <h3
                          style={{ textTransform: "capitalize" }}
                          className="h3"
                        >
                          {firstname}
                        </h3>
                      )}
                      <p
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "500",
                        }}
                      >
                        {fullName}
                      </p>
                      {/* <p>{profile?.user?.email}</p> */}
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
            </div>
          )) ||
            (!firstname && email && (
              <div className="logged-profile-icon">
                <div
                  className="logged-profile-icon-container"
                  ref={containerRef}
                >
                  <h3
                    style={{ textTransform: "capitalize" }}
                    onClick={() => setProfileState((prev) => !prev)}
                  >
                    {email.charAt(0)}
                  </h3>
                  {profileState && (
                    <div className="profile-container">
                      <div className="img-email">
                        <h3
                          style={{ textTransform: "capitalize" }}
                          className="h3"
                        >
                          {email.charAt(0)}
                        </h3>
                        <p>{email}</p>
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
              </div>
            )) ||
            (!profile && !email && (
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
            ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
