import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { url, currency } from "../../assets/assets";

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data?.success) {
        setList(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        setList([]);
        toast.error(res.data?.message || "Failed to fetch items");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching items");
      setList([]);
    }
  };

  const removeFood = async (id) => {
    try {
      const res = await axios.post(`${url}/api/food/remove`, { id });
      if (res.data?.success) {
        toast.success("Item removed");
        fetchList();
      } else {
        toast.error(res.data?.message || "Failed to remove");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add">
      <h3>All Foods List</h3>

      <div className="list-table">
        <div className="list-head">
          {/* Image column removed */}
          <div className="col name">Name</div>
          <div className="col cat">Category</div>
          <div className="col price">Price</div>
          <div className="col act">Action</div>
        </div>

        {list.map((item) => (
          <div key={item._id} className="list-row">
            {/* No image cell */}
            <div className="col name">{item.name}</div>
            <div className="col cat">{item.category}</div>
            <div className="col price">
              {currency}
              {Number(item.price || 0)}
            </div>
            <div className="col act">
              <button className="del" onClick={() => removeFood(item._id)}>
                x
              </button>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="list-row empty">No items yet. Add something edible.</div>
        )}
      </div>
    </div>
  );
};

export default List;
