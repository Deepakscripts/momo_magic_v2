// backend/controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// config
const currency = "inr";
const frontend_URL = "http://localhost:5173";

// helper: only keep valid ObjectIds
const isMongoId = (v) => mongoose.Types.ObjectId.isValid(String(v || ""));

/**
 * Build an items snapshot and subtotal from the user's server cart.
 * cartMap: { [itemId]: quantity }
 * Returns { items:[{itemId,name,price,quantity}], amount:number }
 */
async function buildItemsAndAmount(cartMap = {}) {
  // keep only positive, valid ObjectId keys
  const validIds = Object.keys(cartMap).filter(
    (id) => Number(cartMap[id]) > 0 && isMongoId(id)
  );
  if (validIds.length === 0) return { items: [], amount: 0 };

  const foods = await foodModel.find({ _id: { $in: validIds } }).lean();
  const byId = Object.fromEntries(foods.map((f) => [String(f._id), f]));

  let amount = 0;
  const items = [];
  for (const id of validIds) {
    const q = Number(cartMap[id]) || 0;
    const f = byId[id];
    if (!f) continue; // ignore any id that didn't resolve
    const price = Number(f.price || 0);
    amount += price * q;
    items.push({
      itemId: id,
      name: String(f.name || ""),
      price,
      quantity: q,
    });
  }

  return { items, amount };
}

/** Sanitize a client-provided items snapshot */
function coerceClientCart(clientCart = []) {
  const items = [];
  let amount = 0;

  for (const raw of Array.isArray(clientCart) ? clientCart : []) {
    const quantity = Math.max(0, parseInt(raw?.quantity ?? 0, 10));
    const price = Number(raw?.price ?? 0);
    const name = String(raw?.name ?? "");
    const itemId = String(raw?.itemId ?? "");

    if (!quantity || !name) continue;
    items.push({ itemId, name, price, quantity });
    amount += price * quantity;
  }

  return { items, amount };
}

/**
 * POST /api/order/place  (Stripe path, kept for future use)
 * Body: { firstName, lastName, email?, tableNumber, clientCart? }
 * Auth middleware sets req.body.userId
 * Creates order from SERVER CART snapshot or clientCart (no delivery fee),
 * payment=false, returns Stripe Checkout Session URL.
 */
const placeOrder = async (req, res) => {
  try {
    const { userId, firstName, lastName, email = "", tableNumber, clientCart } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !tableNumber) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    // Prefer client snapshot if provided; fallback to server cart (ObjectId-only)
    let items = [];
    let amount = 0;

    if (Array.isArray(clientCart) && clientCart.length) {
      ({ items, amount } = coerceClientCart(clientCart));
    } else {
      ({ items, amount } = await buildItemsAndAmount(user.cartData || {}));
    }

    if (items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const newOrder = await orderModel.create({
      userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: String(email || "").trim(),
      tableNumber: Number(tableNumber),
      items,
      amount,
      payment: false,
      status: "pending",
    });

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price || 0) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

/**
 * POST /api/order/place-cod  (POC: Pay On Counter)
 * Body: { firstName, lastName, email?, tableNumber, clientCart? }
 * Creates order from SERVER CART snapshot or clientCart, marks payment=true,
 * clears cart, returns success.
 */
const placeOrderCod = async (req, res) => {
  try {
    const { userId, firstName, lastName, email = "", tableNumber, clientCart } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !tableNumber) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    // Prefer client snapshot if provided; fallback to server cart (ObjectId-only)
    let items = [];
    let amount = 0;

    if (Array.isArray(clientCart) && clientCart.length) {
      ({ items, amount } = coerceClientCart(clientCart));
    } else {
      ({ items, amount } = await buildItemsAndAmount(user.cartData || {}));
    }

    if (items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    await orderModel.create({
      userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: String(email || "").trim(),
      tableNumber: Number(tableNumber),
      items,
      amount,
      payment: true, // POC: consider it "paid" operationally
      status: "pending",
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing Order for Admin panel
const listOrders = async (_req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Not Verified" });
  }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };
