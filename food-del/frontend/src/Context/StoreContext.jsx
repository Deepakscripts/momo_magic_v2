import { createContext, useEffect, useState } from "react";
import { food_list as seedFoodList, menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const url = "http://localhost:4000";
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const currency = "₹";
  const deliveryCharge = 50;

  // ---- helpers for local guest cart persistence ----
  const LS_KEY = "guest_cart";

  const readGuestCart = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const writeGuestCart = (data) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data || {}));
    } catch {
      // ignore storage errors
    }
  };

  // keep localStorage in sync with current cartItems when logged out
  useEffect(() => {
    if (!token) writeGuestCart(cartItems);
  }, [cartItems, token]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const next = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      return next;
    });
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const qty = (prev[itemId] || 0) - 1;
      const next = { ...prev };
      if (qty <= 0) delete next[itemId];
      else next[itemId] = qty;
      return next;
    });
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          const itemInfo = food_list.find((product) => product._id === item);
          if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
        }
      } catch {
        // ignore lookup errors
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data || seedFoodList);
  };

  /**
   * Load server cart, merge any guest cart, persist merged on server,
   * then set state to the merged result.
   * Accepts either {token: <jwt>} or a bare string token.
   */
  const loadCartData = async (tokenOrObj) => {
    const hdrs = typeof tokenOrObj === "string" ? { token: tokenOrObj } : tokenOrObj;
    // 1) fetch server cart
    const res = await axios.post(url + "/api/cart/get", {}, { headers: hdrs });
    const serverCart = res?.data?.cartData || {};

    // 2) read guest cart stored locally (from pre-login session)
    const guestCart = readGuestCart();

    // 3) if guest cart has items, ask backend to merge, else use server cart
    let merged = serverCart;
    const guestHasItems = Object.values(guestCart).some(q => Number(q) > 0);

    if (guestHasItems) {
      const mergeRes = await axios.post(
        url + "/api/cart/merge",
        { cart: guestCart },
        { headers: hdrs }
      );
      merged = mergeRes?.data?.cartData || serverCart;
      // clear guest cart after successful merge
      writeGuestCart({});
    }

    // 4) set application state and mirror to localStorage (useful for SSR/fallback)
    setCartItems(merged);
    writeGuestCart(merged); // harmless even if logged in
    return merged;
  };

  // initial boot
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const saved = localStorage.getItem("token");
      if (saved) {
        setToken(saved);
        await loadCartData({ token: saved });
      } else {
        // hydrate cart from guest localStorage for logged-out sessions
        setCartItems(readGuestCart());
      }
    }
    loadData();
  }, []);

  const contextValue = {
    url,
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
}

export default StoreContextProvider;
