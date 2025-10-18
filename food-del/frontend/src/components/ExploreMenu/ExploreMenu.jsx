import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

/**
 * Category strip WITHOUT an "All" pill.
 * Clicking a category sets that filter. "View Menu" button resets it.
 */
const ExploreMenu = ({ category, setCategory }) => {
  const onPick = (name) => setCategory(name);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our mission
        is to satisfy your cravings and elevate your dining experience.
      </p>

      <div className="explore-menu-list">
        {menu_list.map((item) => (
          <div
            key={item.menu_name}
            className={`explore-menu-list-item ${
              String(category) === String(item.menu_name) ? "active" : ""
            }`}
            onClick={() => onPick(item.menu_name)}
            role="button"
            tabIndex={0}
          >
            {/* keep images here if you still use them for categories; hide via CSS if not */}
            <img src={item.menu_image} alt="" className="menu-image" />
            <div className="explore-menu-item-name">{item.menu_name}</div>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
