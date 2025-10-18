import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    // Image is optional now. Keep the field for compatibility.
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const foodModel =
  mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
