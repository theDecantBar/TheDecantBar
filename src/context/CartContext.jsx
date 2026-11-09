import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import LuxuryToast from "../components/common/LuxuryToast";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const GUEST_CART_KEY = "thedecantbar_cart_guest";
const USER_CART_PREFIX = "thedecantbar_cart_user_";
const LEGACY_CART_KEY = "thedecantbar_cart";

/**
 * Returns user-specific storage key so Account A and Account B
 * have completely isolated carts.
 */
const getCartStorageKey = (user) => {
  if (user?.id) {
    return `${USER_CART_PREFIX}${user.id}`;
  }
  if (user?.email) {
    return `${USER_CART_PREFIX}${encodeURIComponent(user.email.toLowerCase().trim())}`;
  }
  return GUEST_CART_KEY;
};

/**
 * Safely loads saved cart from localStorage with fallback to legacy key
 */
const loadSavedCart = (key) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);

    // One-time fallback migration from legacy shared key for guests
    if (key === GUEST_CART_KEY) {
      const legacy = localStorage.getItem(LEGACY_CART_KEY);
      if (legacy) return JSON.parse(legacy);
    }
    return [];
  } catch (error) {
    console.error(`Failed to load cart from ${key}:`, error);
    return [];
  }
};

/**
 * Merges items added as a guest into the user's account cart on login
 */
const mergeCarts = (userCart = [], guestCart = []) => {
  if (!guestCart || guestCart.length === 0) return userCart || [];
  if (!userCart || userCart.length === 0) return guestCart || [];

  const merged = [...userCart];
  guestCart.forEach((guestItem) => {
    const existingIndex = merged.findIndex(
      (item) => item.cartItemId === guestItem.cartItemId
    );
    if (existingIndex > -1) {
      const max = Number(merged[existingIndex].maxStock ?? 99);
      merged[existingIndex] = {
        ...merged[existingIndex],
        quantity: Math.min(
          merged[existingIndex].quantity + guestItem.quantity,
          max
        ),
      };
    } else {
      merged.push(guestItem);
    }
  });
  return merged;
};

export function CartProvider({ children }) {
  let authContext = null;
  try {
    authContext = useAuth();
  } catch {
    authContext = null;
  }
  const user = authContext?.user ?? null;

  const [cartItems, setCartItems] = useState(() => {
    const initialKey = getCartStorageKey(user);
    return loadSavedCart(initialKey);
  });

  const previousUserRef = useRef(user?.id ?? null);
  const isInitialMount = useRef(true);

  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info") => {
    if (!message) return;
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 toasts

    // Auto-dismiss after 3.8 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 3800);
  }, [dismissToast]);

  // Synchronize cart across authentication state changes (Guest -> Login -> Logout -> Other Account)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousUserRef.current = user?.id ?? null;
      return;
    }

    const currentUserId = user?.id ?? null;
    const prevUserId = previousUserRef.current;

    if (currentUserId === prevUserId) return;

    if (currentUserId) {
      // User just logged in: merge any items they picked as a guest into their account cart
      const guestItems = loadSavedCart(GUEST_CART_KEY);
      const userItems = loadSavedCart(getCartStorageKey(user));
      const merged = mergeCarts(userItems, guestItems);

      try {
        localStorage.setItem(getCartStorageKey(user), JSON.stringify(merged));
        localStorage.removeItem(GUEST_CART_KEY);
        localStorage.removeItem(LEGACY_CART_KEY);
      } catch {}

      setCartItems(merged);
    } else {
      // User logged out: active cart clears to empty guest cart so Account B never sees Account A's items
      setCartItems([]);
    }

    previousUserRef.current = currentUserId;
  }, [user]);

  // Save to current user's localStorage whenever cart changes
  useEffect(() => {
    const key = getCartStorageKey(user);
    try {
      localStorage.setItem(key, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems, user]);

  /**
   * Add a product with its selected variant (size) to the cart.
   * If the exact same product and size already exists in the cart, increases its quantity.
   */
  const addToCart = (product, selectedVariant, quantity = 1) => {
    if (!product || !selectedVariant) return false;

    // Issue #4: Default missing stock strictly to 0, never 10
    const availableStock = Number(selectedVariant.stock ?? 0);
    if (availableStock <= 0) {
      showToast(
        `"${product.name} (${selectedVariant.size_ml}ml)" is currently sold out. Click 'Notify Me' on the product page to be alerted on restock.`,
        "warning"
      );
      return false;
    }

    const cartItemId = `${product.id}-${selectedVariant.id}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const currentQty = updated[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > availableStock) {
          showToast(
            `Only ${availableStock} bottle(s) of ${product.name} (${selectedVariant.size_ml}ml) available in stock.`,
            "warning"
          );
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: availableStock,
            maxStock: availableStock,
          };
        } else {
          showToast(
            `Added ${quantity}x ${product.name} (${selectedVariant.size_ml}ml) to your bag.`,
            "success"
          );
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            maxStock: availableStock,
          };
        }
        return updated;
      }

      // New item
      const initialQty = Math.min(quantity, availableStock);
      showToast(
        `Added ${initialQty}x ${product.name} (${selectedVariant.size_ml}ml) to your bag.`,
        "success"
      );

      const newItem = {
        cartItemId,
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        category: product.category || "Fragrance",
        image_url: product.image_url || "",
        size_ml: selectedVariant.size_ml,
        price: Number(selectedVariant.price),
        quantity: initialQty,
        maxStock: availableStock,
      };

      return [...prevItems, newItem];
    });

    return true;
  };

  /**
   * Update quantity of a specific cart item, capping at available maxStock
   */
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartItemId !== cartItemId) return item;

        const max = Number(item.maxStock ?? 99);
        if (newQuantity > max) {
          showToast(
            `Maximum available stock reached (${max} bottle${max === 1 ? "" : "s"}).`,
            "warning"
          );
          return { ...item, quantity: max };
        }

        return { ...item, quantity: newQuantity };
      })
    );
  };

  /**
   * Validate and sync cart items against live catalog products
   */
  const validateCartInventory = useCallback((catalogProducts) => {
    if (!Array.isArray(catalogProducts) || catalogProducts.length === 0) return;

    setCartItems((prevItems) => {
      let changed = false;
      let adjustedCount = 0;

      const updated = prevItems.map((item) => {
        const product = catalogProducts.find((p) => p.id === item.productId);
        if (!product) return item;

        const variant = product.variants?.find((v) => v.id === item.variantId);
        if (!variant) return item;

        const liveStock = Number(variant.stock ?? 0);
        const livePrice = Number(variant.price);
        const isSoldOut = liveStock <= 0;

        let newQty = item.quantity;
        if (isSoldOut) {
          newQty = 0;
        } else if (newQty > liveStock) {
          newQty = liveStock;
          adjustedCount++;
        }

        if (
          item.maxStock !== liveStock ||
          item.isSoldOut !== isSoldOut ||
          item.quantity !== newQty ||
          item.price !== livePrice
        ) {
          changed = true;
          return {
            ...item,
            price: livePrice,
            maxStock: liveStock,
            isSoldOut,
            quantity: newQty,
          };
        }
        return item;
      });

      if (adjustedCount > 0) {
        showToast(
          "Some item quantities in your bag were adjusted to match current available stock.",
          "warning"
        );
      }

      return changed ? updated : prevItems;
    });
  }, [showToast]);

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
    const key = getCartStorageKey(user);
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  // Total quantity of all items in cart (excluding any marked sold out)
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.isSoldOut ? 0 : item.quantity),
    0
  );

  // Total price in INR (excluding sold out items)
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + (item.isSoldOut ? 0 : item.price * item.quantity),
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
        showToast,
        validateCartInventory,
      }}
    >
      {children}
      <LuxuryToast toasts={toasts} onDismiss={dismissToast} />
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
