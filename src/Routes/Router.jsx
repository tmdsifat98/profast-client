import { createBrowserRouter } from "react-router";
import Root from "../Layouts/Root";
import Home from "../Pages/Home/Home";
import AddParcel from "../Pages/AddParcel/AddParcel";

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
    ],
  },
]);
export default router;
