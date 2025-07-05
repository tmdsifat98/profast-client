import { createBrowserRouter } from "react-router";
import Root from "../Layouts/Root";
import Home from "../Pages/Home/Home";
import AddParcel from "../Pages/AddParcel/AddParcel";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login";
import SignUp from "../Pages/Authentication/SignUp";
import Dashboard from "../Layouts/Dashboard";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import { BeARider } from "../Pages/Rider/BeARider";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      {
        path: "/addParcel",
        Component: AddParcel,
        loader: () => fetch("/warehouses.json"),
        hydrateFallbackElement: <p>Loading...</p>,
      },
      {
        path: "/beARider",
        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
        loader: () => fetch("/warehouses.json"),
        hydrateFallbackElement: <p>Loading...</p>,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: Dashboard,
    children: [{ index: true, Component: DashboardHome }],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "signUp", Component: SignUp },
    ],
  },
]);
export default router;
