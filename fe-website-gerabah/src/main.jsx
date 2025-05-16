import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { Provider } from "react-redux";
import { createBrowserRouter } from "react-router";
import store from "./redux/store";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import DashboardPokdarwis from "./pages/DashboardPokdarwis";
import DashboardPemilik from "./pages/dashboardPemilik/DashboardPemilik";
import ProductManagement from "./pages/dashboardPemilik/ProductManagement";
import UpdateProduct from "./pages/dashboardPemilik/UpdateProduct";
import AddProduct from "./pages/dashboardPemilik/AddProduct";


const router = createBrowserRouter([
  {
    path: "/error",
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/products",
    element: <Product />,
  },
  {
    path: "/dashboard-pemilik",
    element: <DashboardPemilik />,
  },
  {
    path: "/dashboard-pokdarwis",
    element: <DashboardPokdarwis />,
  },
  {
    path: "/add-product",
    element: <AddProduct />
  },
  {
    path: "/update-product/:id",
    element: <UpdateProduct />
  },
  {
    path: "/product-management",
    element: <ProductManagement />
  },
  
  // {
  //   path: "/products/:id",
  //   element:<DetilProductPage/>
  // }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
