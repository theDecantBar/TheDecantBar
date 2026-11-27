import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import LuxuryLoader from "./components/common/LuxuryLoader";
import ScrollToTop from "./components/common/ScrollToTop";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";

// Lazy-loaded Storefront Routes
const Products = lazy(() => import("./pages/products/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Account = lazy(() => import("./pages/Account"));
const Reviews = lazy(() => import("./pages/Reviews"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy-loaded Legal & Customer Policies
const Terms = lazy(() => import("./pages/legal/Terms"));
const Privacy = lazy(() => import("./pages/legal/Privacy"));
const ShippingPolicy = lazy(() => import("./pages/legal/ShippingPolicy"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));

// Lazy-loaded Admin Portal Components (excluded from customer storefront bundle)
const AdminRoute = lazy(() => import("./components/admin/AdminRoute"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#11110f]">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#c6a15b] border-t-transparent" />
    </div>
  );
}

export default function App() {
  const { isLoading: authLoading } = useAuth();
  const [loaderTimedOut, setLoaderTimedOut] = useState(false);

  // Safety timeout: never trap user if network or session API hangs during token check
  useEffect(() => {
    if (!authLoading || loaderTimedOut) return;

    const safetyTimer = setTimeout(() => {
      setLoaderTimedOut(true);
    }, 2500);

    return () => {
      clearTimeout(safetyTimer);
    };
  }, [authLoading, loaderTimedOut]);

  const showInitialLoader = authLoading && !loaderTimedOut;

  return (
    <>
      {/* ─── Premium Luxury Loading Experience (Token Verification Only) ─── */}
      <LuxuryLoader show={showInitialLoader} />

      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
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
              <Route path="faq" element={<FAQ />} />
              <Route path="faqs" element={<FAQ />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="account" element={<Account />} />

              {/* Legal & Customer Policy Routes */}
              <Route path="terms" element={<Terms />} />
              <Route path="terms-and-conditions" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="privacy-policy" element={<Privacy />} />
              <Route path="shipping" element={<ShippingPolicy />} />
              <Route path="shipping-policy" element={<ShippingPolicy />} />
              <Route path="refund-policy" element={<RefundPolicy />} />
              <Route path="refunds" element={<RefundPolicy />} />

              {/* 404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
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
        </Suspense>
      </BrowserRouter>
    </>
  );
}
