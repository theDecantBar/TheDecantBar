import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "thedecantbar_cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  /**
   * Add a product with its selected variant (size) to the cart.
   * If the exact same product and size already exists in the cart, increases its quantity.
   */
  const addToCart = (product, selectedVariant, quantity = 1) => {
    if (!product || !selectedVariant) return false;

    const availableStock = Number(selectedVariant.stock ?? 10);
    if (availableStock <= 0) {
      alert("This size is currently sold out! Please click 'Notify Me' on the product page to be alerted on restock.");
      return false;
    }

    const cartItemId = `${product.id}-${selectedVariant.id}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        // Item exists, update quantity
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > availableStock) {
          alert(`Only ${availableStock} bottle(s) currently available in stock.`);
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: availableStock,
            maxStock: availableStock,
          };
        } else {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            maxStock: availableStock,
          };
        }
        return updated;
      }

      // New item
      const newItem = {
        cartItemId,
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        category: product.category || "Fragrance",
        image_url: product.image_url || "",
        size_ml: selectedVariant.size_ml,
        price: Number(selectedVariant.price),
        quantity: Math.min(quantity, availableStock),
        maxStock: availableStock,
      };

      return [...prevItems, newItem];
    });
    return true;
  };

  /**
   * Update quantity of a specific cart item
   */
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  /**
   * Remove an item from the cart
   */
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  /**
   * Clear the entire cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Total quantity of all items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Total price in INR
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
