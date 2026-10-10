import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";
import Container from "../components/ui/Container";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, cartCount, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-[#171715]">
            <ShoppingBag size={32} strokeWidth={1.2} className="text-[#c6a15b]" />
          </div>

          <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
            Your Selection
          </p>

          <h1 className="mt-3 font-display text-4xl text-[#f4efe6] sm:text-5xl">
            Your Bag is Empty
          </h1>

          <p className="mt-4 text-sm text-[#8e8a82]">
            Discover the world's most compelling fragrances, thoughtfully decanted into 2ml, 5ml, and 10ml travel atomizers.
          </p>

          <div className="mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 border border-[#c6a15b] bg-[#c6a15b] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#11110f] transition hover:bg-[#d8c08a]"
            >
              Explore Collection
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-20">
      {/* Page Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
          Review Order
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="font-display text-4xl text-[#f4efe6] sm:text-5xl">
            Shopping Bag ({cartCount} {cartCount === 1 ? "bottle" : "bottles"})
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs uppercase tracking-wider text-[#8e8a82] hover:text-red-400 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Main Grid: Items + Order Summary */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8">
          <div className="divide-y divide-white/10 border-y border-white/10">
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Product Info */}
                <div className="flex items-center gap-5">
                  <div className="h-24 w-20 shrink-0 overflow-hidden border border-white/10 bg-[#1c1c18] flex items-center justify-center p-2">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[10px] uppercase text-[#c6a15b]/50 tracking-wider">
                        Decant
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
                      {item.category}
                    </p>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-display text-xl text-[#f4efe6] hover:text-[#c6a15b] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-[#8e8a82]">
                      Size: <span className="text-[#f4efe6] font-medium">{item.size_ml}ml Decant</span>
                    </p>
                    <p className="mt-2 text-sm text-[#f4efe6] sm:hidden">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:gap-8">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-white/15 bg-[#171715]">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-[#c5c1b9] hover:text-[#c6a15b] transition-colors cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center text-xs font-semibold text-[#f4efe6]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center text-[#c5c1b9] hover:text-[#c6a15b] transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[80px]">
                    <p className="font-medium text-[#f4efe6] text-base">
                      ₹{item.price * item.quantity}
                    </p>
                    <p className="hidden text-[11px] text-[#8e8a82] sm:block">
                      ₹{item.price} each
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-[#8e8a82] hover:text-red-400 transition-colors p-2 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Link */}
          <div className="mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#c6a15b] hover:text-[#d8c08a] transition-colors"
            >
              ← Continue Discovering Fragrances
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 border border-white/10 bg-[#171715] p-6 sm:p-8">
            <h2 className="font-display text-2xl text-[#f4efe6]">
              Order Summary
            </h2>

            <div className="mt-6 divide-y divide-white/10 text-xs text-[#c5c1b9]">
              <div className="flex justify-between pb-4">
                <span>Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})</span>
                <span className="text-[#f4efe6] font-medium text-sm">₹{cartSubtotal}</span>
              </div>

              <div className="flex justify-between py-4">
                <span>Shipping</span>
                <span className="text-[#8e8a82]">Calculated at checkout</span>
              </div>

              <div className="flex justify-between pt-5 text-sm sm:text-base font-semibold text-[#f4efe6]">
                <span>Estimated Total</span>
                <span className="font-display text-2xl text-[#c6a15b]">
                  ₹{cartSubtotal}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="mt-8">
              <Link
                to="/checkout"
                className="flex w-full items-center justify-between gap-4 border border-[#c6a15b] bg-[#c6a15b] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-[#11110f] transition hover:bg-[#d8c08a]"
              >
                <span className="whitespace-nowrap">Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 border-t border-white/10 pt-6 space-y-3 text-[11px] text-[#8e8a82]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#c6a15b] shrink-0" />
                <span>100% Genuine, Handcrafted Decants</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-[#c6a15b] shrink-0" />
                <span>Premium leak-proof glass atomizers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

