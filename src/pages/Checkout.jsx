import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  Lock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Container from "../components/ui/Container";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  createRazorpayOrderApi,
  verifyPaymentAndPlaceOrder,
  placeCodOrder,
} from "../services/authApi";
import {
  calculateShippingFee,
  calculateOrderTotal,
  FREE_SHIPPING_THRESHOLD,
} from "../utils/shipping";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cartItems, cartCount, cartSubtotal, clearCart } = useCart();
  const { token, isAuthenticated } = useAuth();

  // Initial checkout form values start completely empty, even when customer is logged in
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
    orderNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedOrder, setCompletedOrder] = useState(null);

  const fullNameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const pincodeRef = useRef(null);
  const orderNotesRef = useRef(null);

  const fieldRefs = {
    fullName: fullNameRef,
    phone: phoneRef,
    email: emailRef,
    address: addressRef,
    city: cityRef,
    state: stateRef,
    pincode: pincodeRef,
    orderNotes: orderNotesRef,
  };

  const FIELD_ORDER = [
    "fullName",
    "phone",
    "email",
    "address",
    "city",
    "state",
    "pincode",
  ];

  const validateField = (name, value) => {
    const val = String(value || "").trim();
    switch (name) {
      case "fullName": {
        if (!val) return "Please enter your full name.";
        if (val.length < 2) return "Full name must be at least 2 characters.";
        if (!/^[A-Za-z\s.'-]+$/.test(val)) {
          return "Full name can only contain letters, spaces, dots, and hyphens.";
        }
        return "";
      }
      case "phone": {
        let cleanDigits = val.replace(/^(\+91|91|0)/, "").replace(/\D/g, "");
        if (!cleanDigits) return "Please enter your 10-digit mobile number.";
        if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
          return "Please enter a valid 10-digit Indian mobile number.";
        }
        return "";
      }
      case "email": {
        if (!val) return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
          return "Please enter a valid email address.";
        }
        return "";
      }
      case "address": {
        if (!val) return "Please enter your delivery address.";
        if (val.length < 5) return "Please enter a complete delivery address (minimum 5 characters).";
        return "";
      }
      case "city": {
        if (!val) return "Please enter your city.";
        return "";
      }
      case "state": {
        if (!val) return "Please enter your state.";
        return "";
      }
      case "pincode": {
        const cleanPin = val.replace(/\D/g, "");
        if (!cleanPin) return "Please enter your 6-digit PIN code.";
        if (!/^[1-9]\d{5}$/.test(cleanPin)) {
          return "Please enter a valid 6-digit Indian PIN code.";
        }
        return "";
      }
      case "orderNotes": {
        if (val.length > 300) {
          return "Order notes must be 300 characters or fewer.";
        }
        return "";
      }
      default:
        return "";
    }
  };

  const validateAll = (data) => {
    const newErrors = {};
    FIELD_ORDER.forEach((field) => {
      const err = validateField(field, data[field]);
      if (err) newErrors[field] = err;
    });
    if (data.orderNotes) {
      const noteErr = validateField("orderNotes", data.orderNotes);
      if (noteErr) newErrors.orderNotes = noteErr;
    }
    return newErrors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === "phone") {
      let cleanDigits = value.replace(/\D/g, "");
      if (cleanDigits.length > 10 && (cleanDigits.startsWith("91") || cleanDigits.startsWith("0"))) {
        cleanDigits = cleanDigits.replace(/^(91|0)/, "");
      }
      nextValue = cleanDigits.slice(0, 10);
    } else if (name === "pincode") {
      nextValue = value.replace(/\D/g, "").slice(0, 6);
    } else if (name === "orderNotes") {
      nextValue = value.slice(0, 300);
    }

    setFormData((prev) => ({ ...prev, [name]: nextValue }));

    if (touched[name]) {
      const err = validateField(name, nextValue);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }

    if (errorMessage) setErrorMessage("");
  };

  const shippingFee = cartItems.length > 0 ? calculateShippingFee(cartSubtotal) : 0;
  const finalTotal = cartItems.length > 0 ? calculateOrderTotal(cartSubtotal) : 0;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add fragrances before checking out.");
      return;
    }

    if (!isAuthenticated || !token) {
      setErrorMessage("Please log in to place your order.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const validationErrors = validateAll(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const allTouched = FIELD_ORDER.reduce((acc, f) => ({ ...acc, [f]: true }), {});
      setTouched(allTouched);
      setErrorMessage("Please fill in all required fields correctly before placing your order.");

      const firstInvalidField = FIELD_ORDER.find((f) => validationErrors[f]);
      if (firstInvalidField && fieldRefs[firstInvalidField]?.current) {
        fieldRefs[firstInvalidField].current.focus();
        fieldRefs[firstInvalidField].current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const itemPayload = cartItems.map((item) => ({
      id: item.productId || item.id,
      productId: item.productId || item.id,
      variantId: item.variantId,
      name: item.name,
      size_ml: item.size_ml,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url,
    }));

    const cleanPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim().replace(/^(\+91|91|0)/, "").replace(/\D/g, ""),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim().replace(/\D/g, ""),
      orderNotes: formData.orderNotes.trim().slice(0, 300),
      paymentMethod: formData.paymentMethod,
    };

    // -------------------------------------------------------------
    // Branch 1: Cash on Delivery (COD) Flow
    // -------------------------------------------------------------
    if (formData.paymentMethod === "cod") {
      try {
        const codPayload = {
          ...cleanPayload,
          paymentMethod: "cod",
          items: itemPayload,
        };

        const res = await placeCodOrder(codPayload, token);

        const orderSummary = {
          orderNumber: res.order?.orderNumber || "CONFIRMED",
          items: res.order?.items || [...cartItems],
          total: res.order?.total ? Number(res.order.total) : finalTotal,
          subtotal: res.order?.subtotal ? Number(res.order.subtotal) : cartSubtotal,
          shippingFee: res.order?.shippingFee !== undefined ? Number(res.order.shippingFee) : shippingFee,
          customer: {
            ...cleanPayload,
            paymentMethod: "Cash on Delivery",
            paymentStatus: res.order?.paymentStatus || "Pending",
          },
          paymentId: null,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };

        setCompletedOrder(orderSummary);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (codErr) {
        console.error("COD order placement error:", codErr);
        setErrorMessage(
          codErr.message || "Failed to place Cash on Delivery order. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // -------------------------------------------------------------
    // Branch 2: Online Payment via Razorpay Flow
    // -------------------------------------------------------------
    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        throw new Error(
          "Razorpay payment gateway failed to load. Please check your internet connection."
        );
      }

      // 2. Request backend to create Razorpay Order (prices verified server-side)
      const rzpOrderData = await createRazorpayOrderApi(
        {
          total: finalTotal,
          subtotal: cartSubtotal,
          shippingFee: shippingFee,
          fullName: cleanPayload.fullName,
          email: cleanPayload.email,
          phone: cleanPayload.phone,
          items: itemPayload,
        },
        token
      );

      if (!rzpOrderData || !rzpOrderData.orderId) {
        throw new Error("Unable to initialize secure payment. Please try again.");
      }

      // 3. Launch Razorpay Checkout Modal
      const options = {
        key: rzpOrderData.keyId,
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency || "INR",
        name: "The Decant Bar",
        description: "Authentic Luxury Fragrance Decants",
        image: "/images/tdb-logo.png",
        order_id: rzpOrderData.orderId,
        handler: async function (response) {
          try {
            setIsSubmitting(true);

            // 4. Cryptographically verify signature and store order on backend
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              fullName: cleanPayload.fullName,
              email: cleanPayload.email,
              phone: cleanPayload.phone,
              address: cleanPayload.address,
              city: cleanPayload.city,
              state: cleanPayload.state,
              pincode: cleanPayload.pincode,
              orderNotes: cleanPayload.orderNotes,
              items: itemPayload,
              subtotal: cartSubtotal,
              shippingFee: shippingFee,
              total: finalTotal,
            };

            const res = await verifyPaymentAndPlaceOrder(verifyPayload, token);

            const orderSummary = {
              orderNumber: res.order?.orderNumber || "CONFIRMED",
              items: res.order?.items || [...cartItems],
              total: res.order?.total ? Number(res.order.total) : finalTotal,
              subtotal: res.order?.subtotal ? Number(res.order.subtotal) : cartSubtotal,
              shippingFee: res.order?.shippingFee !== undefined ? Number(res.order.shippingFee) : shippingFee,
              customer: {
                ...cleanPayload,
                paymentMethod: "Online (Razorpay)",
                paymentStatus: "Paid",
              },
              paymentId: response.razorpay_payment_id,
              date: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            };

            setCompletedOrder(orderSummary);
            clearCart();
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (verificationErr) {
            console.error("Payment confirmation error:", verificationErr);
            setErrorMessage(
              verificationErr.message ||
                "Payment was received by Razorpay, but verification failed. Please contact support with payment ID: " +
                  response.razorpay_payment_id
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: cleanPayload.fullName,
          email: cleanPayload.email,
          contact: cleanPayload.phone,
        },
        notes: {
          shippingAddress: `${cleanPayload.address}, ${cleanPayload.city}, ${cleanPayload.state} - ${cleanPayload.pincode}`,
        },
        theme: {
          color: "#c6a15b",
          backdrop_color: "#11110f",
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            setErrorMessage(
              "Payment was not completed. You can retry placing your order when ready."
            );
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failResponse) {
        setIsSubmitting(false);
        setErrorMessage(
          failResponse.error?.description ||
            "Online payment was declined or failed. Please try a different card, UPI app, or netbanking account."
        );
      });
      rzp.open();
    } catch (err) {
      console.error("Order initiation error:", err);
      setErrorMessage(err.message || "Failed to initiate payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  // 1. Order Completed Screen
  if (completedOrder) {
    const isCod =
      completedOrder.customer.paymentMethod === "Cash on Delivery" ||
      completedOrder.customer.paymentMethod === "cod";

    return (
      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl border border-white/10 bg-[#171715] p-8 sm:p-12 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b]">
              <CheckCircle2 size={40} strokeWidth={1.5} />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
              {isCod ? "Order Placed · Cash on Delivery" : "Payment Verified · Order Confirmed"}
            </p>

            <h1 className="mt-2 font-display text-4xl text-[#f4efe6] sm:text-5xl">
              Thank You for Your Order!
            </h1>

            <p className="mt-3 text-sm text-[#8e8a82]">
              Order Reference:{" "}
              <strong className="text-[#f4efe6]">#{completedOrder.orderNumber}</strong>
            </p>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-[#c5c1b9] space-y-4">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="text-[#f4efe6] font-medium">
                {completedOrder.customer.fullName}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="text-[#f4efe6] font-medium text-right max-w-xs">
                {completedOrder.customer.address}, {completedOrder.customer.city},{" "}
                {completedOrder.customer.state} - {completedOrder.customer.pincode}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="text-[#c6a15b] font-medium uppercase tracking-wider">
                {isCod ? "Cash on Delivery (COD)" : "Online Payment via Razorpay"}
              </span>
            </div>
            {isCod ? (
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="text-amber-400 font-medium uppercase tracking-wider">
                  Pending (Pay upon delivery)
                </span>
              </div>
            ) : null}
            {completedOrder.paymentId && (
              <div className="flex justify-between">
                <span>Payment Reference:</span>
                <span className="text-[#f4efe6] font-mono text-[11px]">
                  {completedOrder.paymentId}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Standard Shipping:</span>
              <span className={Number(completedOrder.shippingFee) === 0 ? "text-emerald-400 font-semibold uppercase tracking-wider" : "text-[#f4efe6] font-medium"}>
                {Number(completedOrder.shippingFee) === 0 ? "FREE" : `₹${completedOrder.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-4 text-sm font-semibold text-[#f4efe6]">
              <span>{isCod ? "Amount Due on Delivery:" : "Total Amount Paid:"}</span>
              <span className="font-display text-2xl text-[#c6a15b]">
                ₹{completedOrder.total}
              </span>
            </div>
          </div>

          {/* Delivery Notice */}
          <div className="mt-8 border border-white/10 bg-[#151512] p-4 text-xs text-[#8e8a82] leading-relaxed flex items-center gap-3">
            <Truck size={20} className="text-[#c6a15b] shrink-0" />
            <span>
              {isCod ? (
                <>
                  Your authentic decants are being safely sterile-packaged. Please keep exact cash
                  of <strong>₹{completedOrder.total}</strong> or UPI ready at the time of delivery.
                  Estimated delivery within <strong>3–5 business days</strong>.
                </>
              ) : (
                <>
                  Your authentic decants are being safely sterile-packaged. Estimated delivery within{" "}
                  <strong>3–5 business days</strong>. Tracking details will be shared on{" "}
                  {completedOrder.customer.phone}.
                </>
              )}
            </span>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated && (
              <Link
                to="/account"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#11110f] hover:bg-[#d8c08a] transition"
              >
                View in Order History
                <ArrowRight size={14} />
              </Link>
            )}
            <Link
              to="/products"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 border px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition ${
                isAuthenticated
                  ? "border-white/20 bg-transparent text-[#f4efe6] hover:bg-white/5"
                  : "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] hover:bg-[#d8c08a]"
              }`}
            >
              Discover More Fragrances
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // 2. Empty Bag Guard
  if (cartItems.length === 0) {
    return (
      <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-[#171715]">
            <ShoppingBag size={32} strokeWidth={1.2} className="text-[#c6a15b]" />
          </div>
          <h1 className="font-display text-4xl text-[#f4efe6]">Your Bag is Empty</h1>
          <p className="mt-4 text-xs sm:text-sm text-[#8e8a82]">
            Please add your desired perfume decants before proceeding to checkout.
          </p>
          <div className="mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#11110f] hover:bg-[#d8c08a] transition"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // 3. Checkout Form Page
  return (
    <Container className="py-10 sm:py-16">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8e8a82] hover:text-[#c6a15b] transition mb-2"
          >
            <ArrowLeft size={14} /> Return to Shopping Bag
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl text-[#f4efe6]">
            Express Checkout
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#8e8a82]">
          <Lock size={14} className="text-[#c6a15b]" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Checkout Input Form */}
        <div className="lg:col-span-7">
          {/* Guest Login Notice Banner */}
          {!isAuthenticated && (
            <div className="mb-8 border border-[#c6a15b]/30 bg-[#1a1915] p-5 sm:p-6 text-xs text-[#c5c1b9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 text-[#c6a15b]">
                  <Lock size={15} />
                </div>
                <div>
                  <p className="font-semibold text-[#f4efe6] uppercase tracking-wider text-xs">
                    Customer Login Required
                  </p>
                  <p className="mt-1 text-[#8e8a82] leading-relaxed">
                    Please log in to place your order. Your selected fragrances will be safely preserved in your bag.
                  </p>
                </div>
              </div>
              <Link
                to="/login?redirect=/checkout"
                state={{ from: "/checkout" }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#11110f] hover:bg-[#d8c08a] transition shrink-0"
              >
                Log In
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-200">
              <div className="flex items-center gap-3">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              {!isAuthenticated && (
                <Link
                  to="/login?redirect=/checkout"
                  state={{ from: "/checkout" }}
                  className="inline-flex items-center justify-center gap-1.5 border border-[#c6a15b] bg-[#c6a15b] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#11110f] hover:bg-[#d8c08a] transition shrink-0"
                >
                  <span>Log In to Place Order</span>
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-10">
            {/* Section 1: Customer Contact */}
            <div className="border border-white/10 bg-[#171715] p-6 sm:p-8">
              <h2 className="font-display text-2xl text-[#f4efe6] mb-5">
                1. Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    Full Name <span className="text-[#c6a15b]">*</span>
                  </label>
                  <input
                    ref={fullNameRef}
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    className={`w-full border bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:outline-none ${
                      touched.fullName && errors.fullName
                        ? "border-red-500/80 ring-1 ring-red-500/20 focus:border-red-400"
                        : "border-white/15 focus:border-[#c6a15b]"
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Phone Number <span className="text-[#c6a15b]">*</span>
                    </label>
                    <div className="flex">
                      <span
                        className={`inline-flex items-center px-3 border border-r-0 bg-white/5 text-xs font-mono text-[#c6a15b] select-none transition ${
                          touched.phone && errors.phone
                            ? "border-red-500/80"
                            : "border-white/15"
                        }`}
                      >
                        +91
                      </span>
                      <input
                        ref={phoneRef}
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={10}
                        placeholder="Enter 10-digit mobile number"
                        className={`w-full border bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:outline-none ${
                          touched.phone && errors.phone
                            ? "border-red-500/80 ring-1 ring-red-500/20 focus:border-red-400"
                            : "border-white/15 focus:border-[#c6a15b]"
                        }`}
                      />
                    </div>
                    {touched.phone && errors.phone && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                        <AlertCircle size={12} className="shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Email Address <span className="text-[#c6a15b]">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email address"
                      className={`w-full border bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:outline-none ${
                        touched.email && errors.email
                          ? "border-red-500/80 ring-1 ring-red-500/20 focus:border-red-400"
                          : "border-white/15 focus:border-[#c6a15b]"
                      }`}
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                        <AlertCircle size={12} className="shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div className="border border-white/10 bg-[#171715] p-6 sm:p-8">
              <h2 className="font-display text-2xl text-[#f4efe6] mb-5">
                2. Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    Flat / House No. / Street Address <span className="text-[#c6a15b]">*</span>
                  </label>
                  <input
                    ref={addressRef}
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter flat, house no., building, or street address"
                    className={`w-full border bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:outline-none ${
                      touched.address && errors.address
                        ? "border-red-500/80 ring-1 ring-red-500/20 focus:border-red-400"
                        : "border-white/15 focus:border-[#c6a15b]"
                    }`}
                  />
                  {touched.address && errors.address && (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      City <span className="text-[#c6a15b]">*</span>
                    </label>
                    <input
                      ref={cityRef}
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your city"
                      className={`w-full border bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:outline-none ${
                        touched.city && errors.city
                          ? "border-red-500/80 ring-1 ring-red-500/20 focus:border-red-400"
                          : "border-white/15 focus:border-[#c6a15b]"
                      }`}
                    />
                    {touched.city && errors.city && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                        <AlertCircle size={12} className="shrink-0" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      State <span className="text-[#c6a15b]">*</span>
                    </label>
                    <input
                      ref={stateRef}
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your state"
                      className={`w-full border bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:outline-none ${
                        touched.state && errors.state
                          ? "border-red-500/80 ring-1 ring-red-500/20 focus:border-red-400"
                          : "border-white/15 focus:border-[#c6a15b]"
                      }`}
                    />
                    {touched.state && errors.state && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                        <AlertCircle size={12} className="shrink-0" />
                        <span>{errors.state}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Pincode <span className="text-[#c6a15b]">*</span>
                    </label>
                    <input
                      ref={pincodeRef}
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter 6-digit PIN code"
                      className={`w-full border bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:outline-none ${
                        touched.pincode && errors.pincode
                          ? "border-red-500/80 ring-1 ring-red-500/20 focus:border-red-400"
                          : "border-white/15 focus:border-[#c6a15b]"
                      }`}
                    />
                    {touched.pincode && errors.pincode && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                        <AlertCircle size={12} className="shrink-0" />
                        <span>{errors.pincode}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8e8a82] mb-1.5 font-medium">
                    Special Packaging or Delivery Instructions (Optional)
                  </label>
                  <input
                    ref={orderNotesRef}
                    type="text"
                    name="orderNotes"
                    maxLength={300}
                    value={formData.orderNotes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Special packaging or delivery instructions (optional)"
                    className={`w-full border bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:outline-none ${
                      touched.orderNotes && errors.orderNotes
                        ? "border-red-500/80 ring-1 ring-red-500/20 focus:border-red-400"
                        : "border-white/15 focus:border-[#c6a15b]"
                    }`}
                  />
                  {touched.orderNotes && errors.orderNotes && (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors.orderNotes}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method (COD + Online Payment) */}
            <div className="border border-white/10 bg-[#171715] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl text-[#f4efe6]">
                  3. Payment Method
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#c6a15b] bg-[#c6a15b]/10 border border-[#c6a15b]/30">
                  <Lock size={11} /> 100% Secure
                </span>
              </div>

              <div className="space-y-4">
                {/* Option 1: Cash on Delivery (COD) */}
                <label
                  className={`block cursor-pointer border p-5 transition-all ${
                    formData.paymentMethod === "cod"
                      ? "border-[#c6a15b] bg-[#1a1915] shadow-lg shadow-[#c6a15b]/5"
                      : "border-white/10 bg-[#11110f]/70 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="pt-0.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleChange}
                          className="h-4 w-4 accent-[#c6a15b] cursor-pointer"
                        />
                      </div>
                      <div className="mt-[-2px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 text-[#c6a15b]">
                        <Banknote size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#f4efe6]">
                            Cash on Delivery (COD)
                          </span>
                          <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300 uppercase tracking-wider">
                            Pay at Doorstep
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-[#8e8a82] leading-relaxed">
                          Pay with cash or UPI directly to the courier when your authentic decants arrive at your doorstep.
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[#c6a15b]">
                      <Truck size={20} />
                    </div>
                  </div>
                </label>

                {/* Option 2: Pay Online (Razorpay) */}
                <label
                  className={`block cursor-pointer border p-5 transition-all ${
                    formData.paymentMethod === "online"
                      ? "border-[#c6a15b] bg-[#1a1915] shadow-lg shadow-[#c6a15b]/5"
                      : "border-white/10 bg-[#11110f]/70 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="pt-0.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={formData.paymentMethod === "online"}
                          onChange={handleChange}
                          className="h-4 w-4 accent-[#c6a15b] cursor-pointer"
                        />
                      </div>
                      <div className="mt-[-2px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 text-[#c6a15b]">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#f4efe6]">
                            Pay Online (Razorpay)
                          </span>
                          <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 uppercase tracking-wider">
                            Instant Confirmation
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-[#8e8a82] leading-relaxed">
                          Pay securely with UPI (Google Pay, PhonePe, Paytm), Credit / Debit Cards, NetBanking, or Wallets.
                        </p>

                        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                          <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium tracking-wider text-[#c5c1b9] uppercase">
                            UPI / QR
                          </span>
                          <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium tracking-wider text-[#c5c1b9] uppercase">
                            Cards (Visa / Master / RuPay)
                          </span>
                          <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium tracking-wider text-[#c5c1b9] uppercase">
                            NetBanking
                          </span>
                          <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium tracking-wider text-[#c5c1b9] uppercase">
                            Wallets
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[#c6a15b]">
                      <ShieldCheck size={20} />
                    </div>
                  </div>
                </label>
              </div>

              <div className="mt-5 border-t border-white/10 pt-3.5 flex items-center justify-between text-[11px] text-[#8e8a82]">
                <span className="flex items-center gap-1.5">
                  <Lock size={12} className="text-[#c6a15b]" />
                  256-Bit SSL Encrypted & Verified
                </span>
                <span className="text-[10px] text-[#8e8a82] hidden md:inline">
                  Zero card details stored on servers
                </span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-between border border-[#c6a15b] bg-[#c6a15b] px-8 py-5 text-xs font-semibold uppercase tracking-widest text-[#11110f] hover:bg-[#d8c08a] transition-all disabled:opacity-50 cursor-pointer shadow-lg"
            >
              <span className="flex items-center gap-2">
                {isSubmitting && <Loader2 size={16} className="animate-spin text-[#11110f]" />}
                {isSubmitting
                  ? formData.paymentMethod === "cod"
                    ? "Placing Order..."
                    : "Opening Secure Checkout..."
                  : formData.paymentMethod === "cod"
                  ? `Place Order (Cash on Delivery) · ₹${finalTotal}`
                  : `Pay Online & Place Order · ₹${finalTotal}`}
              </span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Right Column: Order Review Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 border border-white/10 bg-[#171715] p-6 sm:p-8">
            <h2 className="font-display text-2xl text-[#f4efe6] mb-6">
              Order Summary ({cartCount} {cartCount === 1 ? "bottle" : "bottles"})
            </h2>

            {/* Free Shipping Alert / Status */}
            {cartSubtotal < FREE_SHIPPING_THRESHOLD ? (
              <div className="mb-6 border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[#c6a15b] shrink-0" />
                  <span>
                    Add <strong className="text-[#f4efe6]">₹{amountForFreeShipping}</strong> more to unlock <strong className="text-[#c6a15b]">FREE shipping</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-6 border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400 shrink-0" />
                <span>You unlocked <strong className="text-[#f4efe6]">FREE shipping</strong> on this order!</span>
              </div>
            )}

            {/* Items Mini List */}
            <div className="divide-y divide-white/10 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-12 shrink-0 border border-white/10 bg-[#1c1c18] flex items-center justify-center p-1">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[9px] text-[#c6a15b]">Decant</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#f4efe6] line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#8e8a82]">
                        {item.size_ml}ml Decant × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#f4efe6] shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="mt-6 border-t border-white/10 pt-4 space-y-3 text-xs text-[#c5c1b9]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#f4efe6] font-medium">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Standard Insured Shipping</span>
                <span className={isFreeShipping ? "text-emerald-400 font-semibold uppercase tracking-wider" : "text-[#f4efe6] font-medium"}>
                  {isFreeShipping ? "FREE" : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-[#f4efe6]">
                <span>Total Due</span>
                <span className="font-display text-2xl text-[#c6a15b]">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="mt-8 border-t border-white/10 pt-6 space-y-3 text-[11px] text-[#8e8a82]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#c6a15b] shrink-0" />
                <span>100% Authentic Hand-Decanted Fragrances</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-[#c6a15b] shrink-0" />
                <span>Leak-proof bubble wrapped secure dispatch</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-[#c6a15b] shrink-0" />
                <span>Fine-mist glass spray atomizers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
