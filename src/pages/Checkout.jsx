import { useState } from "react";
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
  Lock
} from "lucide-react";
import Container from "../components/ui/Container";
import { useCart } from "../context/CartContext";

const SHIPPING_FEE = 99;

export default function Checkout() {
  const { cartItems, cartCount, cartSubtotal, clearCart } = useCart();

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const finalTotal = cartSubtotal + (cartItems.length > 0 ? SHIPPING_FEE : 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const orderNumber = `TDB-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderSummary = {
        orderNumber,
        items: [...cartItems],
        total: finalTotal,
        customer: { ...formData },
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };

      setCompletedOrder(orderSummary);
      clearCart();
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  // 1. Order Completed Screen
  if (completedOrder) {
    return (
      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl border border-white/10 bg-[#171715] p-8 sm:p-12 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#c6a15b]/30 bg-[#c6a15b]/10 text-[#c6a15b]">
              <CheckCircle2 size={40} strokeWidth={1.5} />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
              Order Confirmed
            </p>

            <h1 className="mt-2 font-display text-4xl text-[#f4efe6] sm:text-5xl">
              Thank You for Your Order!
            </h1>

            <p className="mt-3 text-sm text-[#8e8a82]">
              Order Reference: <strong className="text-[#f4efe6]">#{completedOrder.orderNumber}</strong>
            </p>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-[#c5c1b9] space-y-4">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="text-[#f4efe6] font-medium">{completedOrder.customer.fullName}</span>
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
                {completedOrder.customer.paymentMethod === "cod" ? "Cash on Delivery" : "Online UPI / Card"}
              </span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-4 text-sm font-semibold text-[#f4efe6]">
              <span>Total Amount:</span>
              <span className="font-display text-2xl text-[#c6a15b]">
                ₹{completedOrder.total}
              </span>
            </div>
          </div>

          {/* Delivery Notice */}
          <div className="mt-8 border border-white/10 bg-[#151512] p-4 text-xs text-[#8e8a82] leading-relaxed flex items-center gap-3">
            <Truck size={20} className="text-[#c6a15b] shrink-0" />
            <span>
              Your authentic decants are being safely sterile-packaged. Estimated delivery within <strong>3–5 business days</strong>. Tracking details will be shared on {completedOrder.customer.phone}.
            </span>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#11110f] hover:bg-[#d8c08a] transition"
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
          <form onSubmit={handleSubmit} className="space-y-10">
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
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Phone Number <span className="text-[#c6a15b]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Email Address <span className="text-[#c6a15b]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rahul@example.com"
                      className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                    />
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
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 402, Signature Heights, MG Road"
                    className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      City <span className="text-[#c6a15b]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      State <span className="text-[#c6a15b]">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Maharashtra"
                      className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Pincode <span className="text-[#c6a15b]">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8e8a82] mb-1.5 font-medium">
                    Special Packaging or Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleChange}
                    placeholder="e.g. Leave with security / Ring bell twice"
                    className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div className="border border-white/10 bg-[#171715] p-6 sm:p-8">
              <h2 className="font-display text-2xl text-[#f4efe6] mb-5">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-4 border p-4 cursor-pointer transition ${
                    formData.paymentMethod === "cod"
                      ? "border-[#c6a15b] bg-[#c6a15b]/10"
                      : "border-white/15 bg-[#11110f] hover:border-white/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="mt-1 accent-[#c6a15b]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote size={16} className="text-[#c6a15b]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#f4efe6]">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#8e8a82]">
                      Pay in cash or UPI at your doorstep upon receiving the shipment.
                    </p>
                  </div>
                </label>

                {/* Online Payment */}
                <label
                  className={`flex items-start gap-4 border p-4 cursor-pointer transition ${
                    formData.paymentMethod === "online"
                      ? "border-[#c6a15b] bg-[#c6a15b]/10"
                      : "border-white/15 bg-[#11110f] hover:border-white/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleChange}
                    className="mt-1 accent-[#c6a15b]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-[#c6a15b]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#f4efe6]">
                        UPI / Instant Online Payment
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#8e8a82]">
                      Instant QR Code & UPI (Google Pay, PhonePe, Paytm, or Credit/Debit Card).
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-between border border-[#c6a15b] bg-[#c6a15b] px-8 py-5 text-xs font-semibold uppercase tracking-widest text-[#11110f] hover:bg-[#d8c08a] transition-all disabled:opacity-50 cursor-pointer shadow-lg"
            >
              <span>{isSubmitting ? "Processing Order..." : `Place Order · ₹${finalTotal}`}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Right Column: Order Review Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 border border-white/10 bg-[#171715] p-6 sm:p-8">
            <h2 className="font-display text-2xl text-[#f4efe6] mb-6">
              Order Summary ({cartCount} {cartCount === 1 ? "bottle" : "bottles"})
            </h2>

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
              <div className="flex justify-between">
                <span>Standard Insured Shipping</span>
                <span className="text-[#f4efe6] font-medium">₹{SHIPPING_FEE}</span>
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

