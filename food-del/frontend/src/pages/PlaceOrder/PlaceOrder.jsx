import React, { useContext, useEffect, useState, useMemo } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    url,
    setCartItems,
    currency,
    cartItems,
    food_list,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // Dine-in customer info only
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tableNumber: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // compute a local snapshot of the cart for the backend (works for seed + DB items)
  const clientCart = useMemo(() => {
    const items = [];
    Object.entries(cartItems || {}).forEach(([id, qty]) => {
      const quantity = Number(qty) || 0;
      if (quantity <= 0) return;
      const prod = (food_list || []).find((p) => String(p._id) === String(id));
      if (!prod) return;
      items.push({
        itemId: String(prod._id),
        name: String(prod.name || ""),
        price: Number(prod.price || 0),
        quantity,
      });
    });
    return items;
  }, [cartItems, food_list]);

  const subtotal = useMemo(() => getTotalCartAmount(), [cartItems, food_list]);
  const total = subtotal; // no delivery fee

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please sign in to place an order");
      navigate("/cart");
      return;
    }

    if (!data.firstName.trim() || !data.lastName.trim() || !data.tableNumber) {
      toast.error("First name, last name and table number are required");
      return;
    }

    if (!clientCart.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: (data.email || "").trim(),
        tableNumber: Number(data.tableNumber),
        // send snapshot so backend can handle seed items too
        clientCart,
      };

      const response = await axios.post(`${url}/api/order/placecod`, payload, {
        headers: { token },
      });

      if (response.data?.success) {
        toast.success(response.data.message || "Order placed");
        setCartItems({});
        navigate("/myorders");
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to place an order");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Customer Info</p>

        <div className="multi-field">
          <input
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First name"
            required
          />
          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last name"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email address (optional)"
        />

        <div className="multi-field">
          <select
            name="tableNumber"
            value={data.tableNumber}
            onChange={onChangeHandler}
            required
          >
            <option value="" disabled>
              Table Number
            </option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {currency}
                {subtotal}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {currency}
                {total}
              </b>
            </div>
          </div>
        </div>

        <div className="payment">
          <h2>Payment Method</h2>
          <div className="payment-option active">
            <span className="dot" aria-hidden>
              ●
            </span>
            <p>POC (pay on counter)</p>
          </div>
        </div>

        <button className="place-order-submit" type="submit">
          Place Order
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
