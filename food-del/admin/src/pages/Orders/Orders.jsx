import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../../assets/assets";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

/* helpers */
const todayISO = () => new Date().toISOString().slice(0, 10);
const currency = (n) => `₹${Number(n || 0)}`;
const qs = (obj) => {
  const p = [];
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      p.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  });
  return p.length ? `?${p.join("&")}` : "";
};

/* shared date range component (same UX as Analytics) */
function DateRange({ from, to, onChange }) {
  const toDateObj = (iso) => (iso ? parseISO(iso) : null);
  const toISO = (d) => (d ? format(d, "yyyy-MM-dd") : "");

  const [start, setStart] = useState(toDateObj(from));
  const [end, setEnd] = useState(toDateObj(to));

  useEffect(() => setStart(toDateObj(from)), [from]);
  useEffect(() => setEnd(toDateObj(to)), [to]);

  const onFromChange = (d) => {
    if (!d) {
      setStart(null);
      onChange({ from: "" });
      return;
    }
    if (end && d > end) {
      setStart(end);
      setEnd(d);
      onChange({ from: toISO(end), to: toISO(d) });
    } else {
      setStart(d);
      onChange({ from: toISO(d) });
    }
  };

  const onToChange = (d) => {
    if (!d) {
      setEnd(null);
      onChange({ to: "" });
      return;
    }
    if (start && d < start) {
      setEnd(start);
      setStart(d);
      onChange({ from: toISO(d), to: toISO(start) });
    } else {
      setEnd(d);
      onChange({ to: toISO(d) });
    }
  };

  return (
    <div className="control">
      <label>Date range</label>
      <div className="control-row daterow">
        <DatePicker
          selected={start}
          onChange={onFromChange}
          dateFormat="dd-MM-yyyy"
          placeholderText="From"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          calendarStartDay={1}
          showPopperArrow={false}
          className="date-input"
        />
        <span>to</span>
        <DatePicker
          selected={end}
          onChange={onToChange}
          dateFormat="dd-MM-yyyy"
          placeholderText="To"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          calendarStartDay={1}
          showPopperArrow={false}
          className="date-input"
        />
      </div>
    </div>
  );
}

const Orders = () => {
  /* default to today */
  const [from, setFrom] = useState(todayISO());
  const [to, setTo] = useState(todayISO());

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      setLoading(true);
      const r = await axios.get(`${url}/api/order/list${qs({ from, to })}`);
      setOrders(Array.isArray(r.data?.data) ? r.data.data : []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [from, to]);

  const updateStatus = async (orderId, status) => {
    try {
      const r = await axios.post(`${url}/api/order/status`, { orderId, status });
      if (r.data?.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
      } else {
        toast.error(r.data?.message || "Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const totalOrders = orders.length;

  return (
    <div className="orders">
      <div className="orders-head">
        <h3>Orders</h3>
        <div className="orders-filters">
          <DateRange
            from={from}
            to={to}
            onChange={({ from: f, to: t }) => {
              if (f !== undefined) setFrom(f);
              if (t !== undefined) setTo(t);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading…</div>
      ) : (
        <>
          <div className="orders-count">
            {totalOrders} order{totalOrders === 1 ? "" : "s"}
          </div>

          <div className="orders-list">
            {orders.map((order) => (
              <div className="order" key={order._id}>
                {/* image removed on purpose */}

                <div className="order-content">
                  <p className="order-items">
                    {order.items.map((i) => `${i.name} x ${i.quantity}`).join(", ")}
                  </p>
                  <p className="order-customer">
                    {order.firstName || "Test"} {order.lastName || "User"}
                  </p>
                  <div className="order-meta">
                    <span className="chip">Email: {order.email || "—"}</span>
                    <span className="chip">Table: {order.tableNumber ?? "—"}</span>
                    <span className="chip">
                      Items: {order.items?.reduce((s, i) => s + (i.quantity || 0), 0) || 0}
                    </span>
                    <span className="chip">Total: {currency(order.amount)}</span>
                    <span className="chip ts">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <select
                  className="order-status"
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="served">Served</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
