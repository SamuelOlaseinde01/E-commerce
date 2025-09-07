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
import Products, { loader as productsLoader } from "./user-components/Products";
import Layout, { loader as userLayoutLoader } from "./user-components/layout";
import Product, {
  loader as productLoader,
  action as productAction,
} from "./user-components/Product";
import Logout from "./user-components/Logout";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
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
        <Route path="/logout" element={<Logout />} />
        <Route path="/products" element={<Layout />} loader={userLayoutLoader}>
          <Route index element={<Products />} loader={productsLoader} />
          <Route
            path=":id"
            element={<Product />}
            loader={productLoader}
            action={productAction}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </>
    )
  );
  return <RouterProvider router={router} />;
}
