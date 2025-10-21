// backend/routes/devRoute.js
import express from "express";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

const router = express.Router();

// Safety gate for seeding
function ensureDev(req, res, next) {
  if (process.env.ALLOW_DEV_SEED !== "true") {
    return res.status(403).json({ success: false, message: "Dev seeding disabled" });
  }
  next();
}

router.post("/seed", ensureDev, async (req, res) => {
  try {
    const usersCount = Number(req.body.users || 60);
    const ordersCount = Number(req.body.orders || 200);

    // demo dishes
    const dishes = [
      { _id: "d1",  name: "Veg Momos",        price: 120 },
      { _id: "d2",  name: "Chicken Momos",    price: 160 },
      { _id: "d3",  name: "Paneer Tikka",     price: 220 },
      { _id: "d4",  name: "Masala Fries",     price: 130 },
      { _id: "d5",  name: "Sweet Lassi",      price: 90  },
      { _id: "d6",  name: "Hakka Noodles",    price: 180 },
      { _id: "d7",  name: "Spring Rolls",     price: 140 },
      { _id: "d8",  name: "Tandoori Platter", price: 350 },
      { _id: "d9",  name: "Schezwan Rice",    price: 170 },
      { _id: "d10", name: "Brownie Sundae",   price: 150 },
    ];

    // 1) Create users spread across last ~35 days
    const users = [];
    for (let i = 0; i < usersCount; i++) {
      const d = new Date();
      d.setDate(d.getDate() - Math.floor(Math.random() * 35));
      users.push({
        name: `User${i + 1}`,
        phoneNumber: `90000${String(1000 + i)}`,
        createdAt: d,
        updatedAt: d,
        cartData: {},
      });
    }

    // insert and capture the inserted ids
    const insertedUsers = await userModel.insertMany(users, { ordered: false });
    let userIds = insertedUsers?.map(u => String(u._id)) || [];

    // fallback: if nothing inserted (e.g., duplicates), pull existing
    if (userIds.length === 0) {
      const existing = await userModel.find({}, { _id: 1 }).lean();
      userIds = existing.map(u => String(u._id));
    }

    if (userIds.length === 0) {
      return res.json({ success: false, message: "No users available to attach orders" });
    }

    // 2) Create orders with 2–4 DISTINCT items each so combos exist
    const orders = [];
    for (let i = 0; i < ordersCount; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const tableNumber = 1 + Math.floor(Math.random() * 5);

      const targetCount = 2 + Math.floor(Math.random() * 3); // 2..4 distinct items
      const seen = new Set();
      const picked = [];

      while (picked.length < targetCount) {
        const it = dishes[Math.floor(Math.random() * dishes.length)];
        if (seen.has(it._id)) continue;
        seen.add(it._id);
        const qty = 1 + Math.floor(Math.random() * 3);
        picked.push({ itemId: it._id, name: it.name, price: it.price, quantity: qty });
      }

      const amount = picked.reduce((s, p) => s + p.price * p.quantity, 0);
      const d = new Date();
      d.setDate(d.getDate() - Math.floor(Math.random() * 35));

      orders.push({
        userId,
        firstName: "Test",
        lastName: "User",
        email: "",
        tableNumber,
        items: picked,
        amount,
        status: "served",
        payment: true,
        createdAt: d,
        updatedAt: d,
      });
    }

    await orderModel.insertMany(orders, { ordered: false });

    res.json({
      success: true,
      message: "Seeded",
      users: usersCount,
      orders: ordersCount
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: "Seed error" });
  }
});

router.post("/purge", ensureDev, async (_req, res) => {
  try {
    await orderModel.deleteMany({});
    await userModel.deleteMany({});
    res.json({ success: true, message: "Purged users and orders" });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: "Purge error" });
  }
});

export default router;
