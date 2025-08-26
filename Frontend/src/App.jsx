import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login, { action as userLoginAction } from "./user-components/Login";
import "./style.css";
import Register, {
  action as userRegisterAction,
} from "./user-components/register";
import NotFound from "./NotFound";
import CompleteProfile, {
  action as completeProfileAction,
  loader as completeLoaderAction,
} from "./user-components/CompleteProfile";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} action={userLoginAction} />
        <Route
          path="/register"
          element={<Register />}
          action={userRegisterAction}
        />
        <Route
          path="/complete-profile"
          element={<CompleteProfile />}
          loader={completeLoaderAction}
          action={completeProfileAction}
        />
        <Route path="*" element={<NotFound />} />
      </>
    )
  );
  return <RouterProvider router={router} />;
}
