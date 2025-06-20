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
import DetilProductPage from "./pages/DetilProductPage";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/booking/BookingPage";
import Galery from "./pages/Galery";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrdersPage from "./pages/Order/OrderPage";
import OrderDetailPage from "./pages/Order/OrderDetailPage";
import AdminCustomOrders from "./pages/dashboardPemilik/orderCustom/AdminCustomOrders ";
import AppLayout from "./components/layouts/AppLayout.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "booking-kunjungan", element: <BookingPage /> },
      { path: "products", element: <Product /> },
      { path: "products/:id", element: <DetilProductPage /> },
      { path: "galery", element: <Galery /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "checkout/:id", element: <CheckoutPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "orders/:id", element: <OrderDetailPage /> },
      { path: "dashboard-pemilik", element: <DashboardPemilik /> },
      { path: "dashboard-pokdarwis", element: <DashboardPokdarwis /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "update-product/:id", element: <UpdateProduct /> },
      { path: "product-management", element: <ProductManagement /> },
      { path: "custom-orders", element: <AdminCustomOrders /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
