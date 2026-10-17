import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import LuxuryLoader from "./components/common/LuxuryLoader";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Products from "./pages/products/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Reviews from "./pages/Reviews";

// Admin Portal Components
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminReviews from "./pages/admin/AdminReviews";

export default function App() {
  const { isLoading: authLoading } = useAuth();
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  // Manage initial boot loading sequence
  useEffect(() => {
    let timer;

    // Once auth verification settles, smoothly dismiss the initial luxury loader
    if (!authLoading) {
      // Small intentional minimum presentation (550ms) to ensure the
      // golden signature line and typography reveal gracefully on fast cache
      timer = setTimeout(() => {
        setShowInitialLoader(false);
      }, 550);
    }

    // Safety timeout: never trap user if network or session API hangs
    const safetyTimer = setTimeout(() => {
      setShowInitialLoader(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, [authLoading]);

  return (
    <>
      {/* ─── Premium Luxury Loading Experience (Initial Boot Only) ─── */}
      <LuxuryLoader show={showInitialLoader} />

      <BrowserRouter>
        <Routes>
          {/* Public Storefront Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/shop" element={<Products />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="account" element={<Account />} />
          </Route>

          {/* Protected Administrator Hub */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="reviews" element={<AdminReviews />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
