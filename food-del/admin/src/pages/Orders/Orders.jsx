import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets, url, currency } from "../../assets/assets";

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data?.success) {
        // If your backend already sorts newest first, you can drop .reverse()
        setOrders(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setOrders([]);
        toast.error(response.data?.message || "Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const next = event.target.value;
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: next,
      });
      if (response.data?.success) {
        await fetchAllOrders();
      } else {
        toast.error(response.data?.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Orders</h3>
      <div className="order-list">
        {orders.map((order) => {
          const id = order._id;
          const items = Array.isArray(order.items) ? order.items : [];
          const fullName = [order.firstName, order.lastName].filter(Boolean).join(" ") || "—";
          const email = order.email || "—";
          const tableNumber =
            typeof order.tableNumber === "number" ? order.tableNumber : "—";
          const amount = Number(order.amount || 0);

          return (
            <div key={id} className="order-item">
              <img src={assets.parcel_icon} alt="" />

              <div className="order-main">
                <p className="order-item-food">
                  {items.length === 0
                    ? "No items"
                    : items
                        .map((it) => `${it.name || it.itemId || "Item"} x ${it.quantity || 0}`)
                        .join(", ")}
                </p>

                <p className="order-item-name">{fullName}</p>

                <div className="order-meta">
                  <span className="order-meta-chip">Email: {email}</span>
                  <span className="order-meta-chip">Table: {tableNumber}</span>
                </div>
              </div>

              <p className="order-count">Items: {items.length}</p>

              <p className="order-amount">
                {currency}
                {amount}
              </p>

              <select
                onChange={(e) => statusHandler(e, id)}
                value={order.status || "pending"}
              >
                {/* New status values used by backend */}
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="served">Served</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;
