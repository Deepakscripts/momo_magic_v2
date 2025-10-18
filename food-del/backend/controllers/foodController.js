import foodModel from "../models/foodModel.js";

// GET /api/food/list
export const listFood = async (_req, res) => {
  try {
    const data = await foodModel.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data });
  } catch (err) {
    console.error("listFood error:", err);
    res.json({ success: false, message: "Error fetching items" });
  }
};

// POST /api/food/add
// Body: { name, description?, category, price }
export const addFood = async (req, res) => {
  try {
    const { name, description = "", category, price } = req.body || {};
    if (!name || !category || price == null) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const doc = await foodModel.create({
      name: String(name).trim(),
      description: String(description || "").trim(),
      category: String(category).trim(),
      price: Number(price),
      // image is intentionally ignored (optional)
    });

    res.json({ success: true, data: doc });
  } catch (err) {
    console.error("addFood error:", err);
    res.json({ success: false, message: "Error adding item" });
  }
};

// POST /api/food/remove
// Body: { id }
export const removeFood = async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) return res.json({ success: false, message: "Missing id" });

    const result = await foodModel.findByIdAndDelete(id);
    if (!result) {
      return res.json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    console.error("removeFood error:", err);
    res.json({ success: false, message: "Error removing item" });
  }
};
