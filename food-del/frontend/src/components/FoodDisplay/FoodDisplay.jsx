import React, { useContext } from "react";
import "./FoodDisplay.css"; // keep your existing styles
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  const list = (food_list || []).filter((item) => {
    if (!category || category === "All") return true;
    return String(item.category || "") === String(category);
  });

  return (
    <div className="food-display">
      <div className="food-display-list">
        {list.map((item) => (
          <FoodItem
            key={item._id}           // never use index here
            _id={item._id}           // pass the real ID
            name={item.name}
            price={item.price}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
