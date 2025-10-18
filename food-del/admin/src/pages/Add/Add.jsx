import React, { useState } from "react";
import "./Add.css";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../../assets/assets";

const Add = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Salad",
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!data.name.trim()) return toast.error("Name is required");
    if (!data.price || Number(data.price) <= 0) return toast.error("Price must be > 0");

    try {
      setSubmitting(true);

      // We send JSON only (no image nonsense).
      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        category: data.category,
        price: Number(data.price),
      };

      const res = await axios.post(`${url}/api/food/add`, payload);
      if (res.data?.success) {
        toast.success("Item added");
        setData({ name: "", description: "", category: "Salad", price: "" });
      } else {
        toast.error(res.data?.message || "Failed to add");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmit}>
        <div className="add-title">Add item</div>

        {/* No upload field anymore. */}
        <div className="add-field">
          <label className="label">Product name</label>
          <input
            name="name"
            placeholder="Type here"
            value={data.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="add-field">
          <label className="label">Product description</label>
          <textarea
            name="description"
            placeholder="Write content here"
            rows={5}
            value={data.description}
            onChange={onChange}
          />
        </div>

        <div className="add-row">
          <div className="add-field">
            <label className="label">Product category</label>
            <select name="category" value={data.category} onChange={onChange}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-field">
            <label className="label">Product price</label>
            <input
              name="price"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={data.price}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <button className="add-btn" disabled={submitting}>
          {submitting ? "Adding..." : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default Add;
