import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import ProductDetail from "./page/ProductDetail.jsx";
import "./index.css";
import Cart from "./page/Cart.jsx";
import Login from "./components/auth/Login.jsx";
import Checkout from "./page/Checkout.jsx";
import History from "./page/History.jsx";
import LikedProducts from "./page/LikeProduct.jsx";
import 'react-confirm-alert/src/react-confirm-alert.css';


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/history" element={<History />} />
        <Route path="/liked" element={<LikedProducts />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
