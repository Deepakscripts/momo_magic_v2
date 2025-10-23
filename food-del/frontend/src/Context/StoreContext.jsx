// frontend/src/Context/StoreContext.jsx
import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // Prefer env; fallback to same host the browser is using
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    `http://${window.location.hostname}:4000`;
  const url = API_BASE;

  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const currency = "₹";
  const deliveryCharge = 0;

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
    if (!itemId) return;
    setCartItems((prev) => {
      const next = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      return next;
    });
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    if (!itemId) return;
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
          const itemInfo = food_list.find(
            (product) => String(product._id) === String(item)
          );
          if (itemInfo) totalAmount += Number(itemInfo.price || 0) * cartItems[item];
        }
      } catch {
        // ignore lookup errors
      }
    }
    return totalAmount;
  };

  // Ensure every item has a stable string _id
  const normalizeIds = (list) =>
    (list || []).map((it) => {
      const id = it?._id ?? it?.id ?? it?.itemId;
      return { ...it, _id: id != null ? String(id) : undefined };
    });

  // Fetch items from backend only (no local seed)
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      const dbItems = Array.isArray(response?.data?.data) ? response.data.data : [];
      setFoodList(normalizeIds(dbItems));
    } catch (err) {
      console.error("Error fetching food list:", err);
      setFoodList([]); // safe fallback if API fails
    }
  };

  /**
   * Load server cart, merge any guest cart, persist merged on server,
   * then set state to the merged result.
   * Accepts either {token: <jwt>} or a bare string token.
   */
  const loadCartData = async (tokenOrObj) => {
    const hdrs =
      typeof tokenOrObj === "string" ? { token: tokenOrObj } : tokenOrObj;

    const res = await axios.post(url + "/api/cart/get", {}, { headers: hdrs });
    const serverCart = res?.data?.cartData || {};

    const guestCart = readGuestCart();
    let merged = serverCart;
    const guestHasItems = Object.values(guestCart).some((q) => Number(q) > 0);

    if (guestHasItems) {
      const mergeRes = await axios.post(
        url + "/api/cart/merge",
        { cart: guestCart },
        { headers: hdrs }
      );
      merged = mergeRes?.data?.cartData || serverCart;
      writeGuestCart({});
    }

    setCartItems(merged);
    writeGuestCart(merged);
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
    setCartItems,
    deliveryCharge,
    currency,
    loadCartData,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
