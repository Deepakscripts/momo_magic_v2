// backend/controllers/analyticsController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

// 1) New customers and daily series
export async function newCustomers(req, res) {
  try {
    const days = Number(req.query.days || 28);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const series = await userModel.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: { $dateFromParts: { year: "$_id.y", month: "$_id.m", day: "$_id.d" } },
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const within = (n) => {
      const from = new Date(now);
      from.setDate(now.getDate() - n + 1);
      from.setHours(0, 0, 0, 0);
      return { $gte: from, $lte: now };
    };

    const countIn = async (n) =>
      userModel.countDocuments({ createdAt: within(n) });

    const summary = {
      d1: await countIn(1),
      d7: await countIn(7),
      d14: await countIn(14),
      d21: await countIn(21),
      d28: await countIn(28),
      today: await userModel.countDocuments({ createdAt: { $gte: dayStart, $lte: now } }),
    };

    res.json({ success: true, data: { series, summary } });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: "Error" });
  }
}

// 2) Repeat rate
export async function repeatRate(_req, res) {
  try {
    const grouped = await orderModel.aggregate([
      { $group: { _id: "$userId", c: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          repeatUsers: { $sum: { $cond: [{ $gt: ["$c", 1] }, 1, 0] } },
        },
      },
    ]);
    const { totalUsers = 0, repeatUsers = 0 } = grouped[0] || {};
    const repeatRate = totalUsers ? (repeatUsers / totalUsers) * 100 : 0;
    res.json({ success: true, data: { totalUsers, repeatUsers, repeatRate } });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: "Error" });
  }
}

// 3) Top/Least sellers
export async function dishRank(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit || 10), 50);
    const order = String(req.query.order || "desc") === "asc" ? 1 : -1;

    const rows = await orderModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: { id: "$items.itemId", name: "$items.name" },
          totalQty: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalQty: order, revenue: order } },
      { $limit: limit },
      { $project: { _id: 0, itemId: "$_id.id", name: "$_id.name", totalQty: 1, revenue: 1 } },
    ]);

    res.json({ success: true, data: rows });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: "Error" });
  }
}

// 4) Revenue by week in a month (?month=YYYY-MM)
export async function revenueByWeek(req, res) {
  try {
    const monthParam = String(req.query.month || "");
    const [y, m] = monthParam.split("-").map(Number);
    const now = new Date();
    const year = y || now.getFullYear();
    const month = m || now.getMonth() + 1;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const rows = await orderModel.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { week: { $isoWeek: "$createdAt" } },
          totalRevenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.week": 1 } },
    ]);

    res.json({ success: true, data: { month: `${year}-${String(month).padStart(2, "0")}`, rows } });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: "Error" });
  }
}

// 5) Popular pairs
// 5) Popular pairs (index-based double unwind; no $function)
// 5) Popular pairs (index-based, preserves pre-unwind array)
export async function popularCombos(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit || 10), 50);

    const pairs = await orderModel.aggregate([
      // 1) Normalize to string IDs
      {
        $project: {
          items: {
            $map: {
              input: "$items",
              as: "it",
              in: { $toString: "$$it.itemId" }
            }
          }
        }
      },

      // 2) Deduplicate within each order
      { $addFields: { items: { $setUnion: ["$items", []] } } },

      // Skip orders that don't have at least two distinct items
      { $match: { "items.1": { $exists: true } } },

      // 3) Preserve a copy of the full array BEFORE any unwind
      { $set: { itemsCopy: "$items" } },

      // 4) Double-unwind with indexes so we can enforce i < j
      { $unwind: { path: "$items", includeArrayIndex: "i" } },
      { $unwind: { path: "$itemsCopy", includeArrayIndex: "j" } },

      // 5) Keep only unordered pairs (i < j) so (A,B) == (B,A) and no self-pairs
      { $match: { $expr: { $lt: ["$i", "$j"] } } },

      // 6) Group and count across orders
      { $group: { _id: { a: "$items", b: "$itemsCopy" }, count: { $sum: 1 } } },

      // 7) Sort and limit
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    res.json({ success: true, data: pairs });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: "Error" });
  }
}
